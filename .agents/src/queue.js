/**
 * Sequential render queue
 * Ensures only one job processes at a time to prevent WebGL memory starvation
 */
class RenderQueue {
    constructor() {
        this.queue = Promise.resolve();
        this.activeJob = null;
        this.jobCount = 0;
    }

    /**
     * Enqueue a render job
     * @param {Function} jobFn - Async function that performs the render
     * @returns {Promise} Resolves with job result
     */
    async enqueue(jobFn) {
        const jobId = ++this.jobCount;
        
        return new Promise((resolve, reject) => {
            this.queue = this.queue.then(async () => {
                this.activeJob = jobId;
                console.log(`[Queue] Job #${jobId} started`);
                
                try {
                    const result = await jobFn();
                    console.log(`[Queue] Job #${jobId} completed`);
                    resolve(result);
                } catch (err) {
                    console.error(`[Queue] Job #${jobId} failed:`, err.message);
                    reject(err);
                } finally {
                    this.activeJob = null;
                }
            }).catch(reject);
        });
    }

    /**
     * Get current queue status
     */
    getStatus() {
        return {
            activeJob: this.activeJob,
            totalJobs: this.jobCount,
            queued: this.queue !== Promise.resolve()
        };
    }
}

module.exports = RenderQueue;
