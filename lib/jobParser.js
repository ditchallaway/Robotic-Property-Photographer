/**
 * Job specification parser and validator
 */

function validateJob(job) {
    const errors = [];

    if (!job.centroid) {
        errors.push("Missing 'centroid' object { lon, lat }");
    } else {
        if (typeof job.centroid.lon !== 'number') errors.push("'centroid.lon' must be a number");
        if (typeof job.centroid.lat !== 'number') errors.push("'centroid.lat' must be a number");
    }

    if (job.elevation !== undefined && typeof job.elevation !== 'number') {
        errors.push("'elevation' must be a number");
    }

    if (!job.boundary || !Array.isArray(job.boundary)) {
        errors.push("'boundary' must be an array of coordinates [[lon, lat], ...]");
    }

    // Optional fields
    if (job.acreage && typeof job.acreage !== 'string') {
        errors.push("'acreage' must be a string (e.g., '5.00 ACRES')");
    }

    if (job.shotList && !Array.isArray(job.shotList)) {
        errors.push("'shotList' must be an array");
    }

    if (errors.length > 0) {
        throw new Error(`Job validation failed:\n- ${errors.join('\n- ')}`);
    }

    return true;
}

function normalizeJob(rawJob) {
    // Basic normalization for flexibility
    const job = { ...rawJob };

    // Support centroid as [lon, lat] or { lon, lat }
    if (Array.isArray(job.centroid)) {
        job.centroid = { lon: job.centroid[0], lat: job.centroid[1] };
    }

    // Support geometry as boundary if provided in GeoJSON-like format
    if (job.geometry && job.geometry.coordinates && !job.boundary) {
        job.boundary = job.geometry.coordinates[0];
    }

    // Support ll_gisacre as acreage
    if (job.ll_gisacre && !job.acreage) {
        job.acreage = `${parseFloat(job.ll_gisacre).toFixed(2)} ACRES`;
    }

    // Support centroid_elevation as elevation
    if (job.centroid_elevation !== undefined && job.elevation === undefined) {
        job.elevation = job.centroid_elevation;
    }

    validateJob(job);
    return job;
}

module.exports = {
    normalizeJob,
    validateJob
};
