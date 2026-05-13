import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Full
// Nodes   : 20  |  Connections: 16
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenClickingExecuteWorkflow        manualTrigger              
// HttpRequest                        httpRequest                
// EditFields                         set                        
// HttpRequest1                       httpRequest                
// EditFields8                        set                        
// EditFields9                        set                        
// Code1                              code                       
// EditFields1                        set                        
// DispatchAWorkflowEventAndWaitForCompletion github                     [creds]
// HttpRequest2                       httpRequest                
// HttpRequest3                       httpRequest                [creds]
// Compression                        compression                
// CodeInJavascript                   code                       
// UploadAFile                        s3                         [creds]
// EditFields2                        set                        
// StickyNote1                        stickyNote                 
// StickyNote2                        stickyNote                 
// EditFields3                        set                        
// StickyNote                         stickyNote                 
// AllImagesUrlBuilder                code                       
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenClickingExecuteWorkflow
//    → HttpRequest
//      → HttpRequest1
//        → EditFields
//          → EditFields9
//            → Code1
//              → EditFields8
//                → EditFields1
//                  → DispatchAWorkflowEventAndWaitForCompletion
//                    → HttpRequest2
//                      → HttpRequest3
//                        → Compression
//                          → CodeInJavascript
//                            → UploadAFile
//                              → EditFields3
//                                → EditFields2
//                                  → AllImagesUrlBuilder
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "eiHeW6leMz4NRikO",
    name: "Full",
    active: true,
    isArchived: false,
    projectId: "SxZfT7rxAv9cKdRm",
    settings: { executionOrder: "v1", binaryMode: "separate", timeSavedMode: "fixed", callerPolicy: "workflowsFromSameOwner", availableInMCP: false }
})
export class FullWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        id: "7fe0934f-a94a-40d6-8122-cd19344755da",
        name: "When clicking ‘Execute workflow’",
        type: "n8n-nodes-base.manualTrigger",
        version: 1,
        position: [-2928, -48]
    })
    WhenClickingExecuteWorkflow = {};

    @node({
        id: "79bdc4a0-a87c-4ab8-ae34-74434bc5c188",
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        version: 4.3,
        position: [-2704, -48]
    })
    HttpRequest = {
        url: "https://auto.brokertricks.com/webhook/ungrid",
        options: {}
    };

    @node({
        id: "2f3d72fa-6b0e-4bfb-9099-cc93c4caecea",
        name: "Edit Fields",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [-2256, -48]
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: "411ea856-ca12-4349-9313-e3c087580f43",
                    name: "ap parcel number",
                    value: "={{ $('HTTP Request').item.json.fields.parcelnumb }}",
                    type: "string"
                },
                {
                    id: "f519640f-87eb-44dc-aef6-eacdd48afd0f",
                    name: "owner",
                    value: "={{ $('HTTP Request').item.json.fields.owner }}",
                    type: "string"
                },
                {
                    id: "2f2f92f2-3a15-4405-a5a6-e192f98bad73",
                    name: "centroid",
                    value: "={{ $('HTTP Request').item.json.centroid }}",
                    type: "array"
                },
                {
                    id: "211a05ff-4ba4-465b-96c8-2355925a86cc",
                    name: "lat",
                    value: "={{ $('HTTP Request').item.json.fields.lat }}",
                    type: "string"
                },
                {
                    id: "0957b2c4-2d14-4a22-b3d6-b38b8ba4182c",
                    name: "lon",
                    value: "={{ $('HTTP Request').item.json.fields.lon }}",
                    type: "string"
                },
                {
                    id: "f421ae78-f1a1-4e76-a374-ecc15170c676",
                    name: "ll_gisacre",
                    value: "={{ $('HTTP Request').item.json.fields.ll_gisacre }}",
                    type: "number"
                },
                {
                    id: "4c435da0-704e-4e80-9a11-89349464e6c2",
                    name: "geometry",
                    value: "={{ $('HTTP Request').item.json.geometry }}",
                    type: "object"
                },
                {
                    id: "57c40033-7331-4897-b3c4-2589c8422c62",
                    name: "county",
                    value: "={{ $('HTTP Request').item.json.context[3].name }}",
                    type: "string"
                },
                {
                    id: "a78441f2-c1ba-4a04-b602-5daf1947ab24",
                    name: "elevation",
                    value: "={{ $json.results && $json.results[0] ? $json.results[0].elevation : 100 }}",
                    type: "number"
                },
                {
                    id: "79de9b5b-743c-4c2e-9a30-b954e9352f5f",
                    name: "customer_id",
                    value: "cust_12345",
                    type: "string"
                },
                {
                    id: "9c19d833-5884-4467-bb5f-ab1f7a435c5f",
                    name: "order_id",
                    value: "order_12345",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "42b264ed-cfde-448c-b248-99c978fb4932",
        name: "HTTP Request1",
        type: "n8n-nodes-base.httpRequest",
        version: 4.3,
        position: [-2480, -48]
    })
    HttpRequest1 = {
        url: "=https://maps.googleapis.com/maps/api/elevation/json?locations={{ $json.fields.lat }},{{ $json.fields.lon }}&key={{ $env.GOOGLE_API_KEY }}",
        options: {}
    };

    @node({
        id: "19371f71-914a-42ce-b31c-aabcf1b40d41",
        name: "Edit Fields8",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [-1584, -48]
    })
    EditFields8 = {
        assignments: {
            assignments: [
                {
                    id: "b687ed80-e00e-4108-b1e9-1d1a378ac748",
                    name: "srcmap",
                    value: "=https://maps.googleapis.com/maps/api/staticmap?size=1200x1200&scale=2&maptype=hybrid&{{ $json.pathString }}&key={{ $env.GOOGLE_API_KEY }}",
                    type: "string"
                },
                {
                    id: "fd464050-4749-47b5-bde9-4ecd7b47ab58",
                    name: "acres",
                    value: "={{ $('HTTP Request').item.json.fields.lglacres }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "8ba9f227-dceb-4d87-9869-8ebd5ea74586",
        name: "Edit Fields9",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [-2032, -48]
    })
    EditFields9 = {
        assignments: {
            assignments: [
                {
                    id: "fbffd5dc-6e53-4038-a1b1-9d53ccc9986c",
                    name: "owner",
                    value: "={{ $if($json.owner, $isEmpty(),$('HTTP Request').item.json.fields.primaryownername ) }}",
                    type: "string"
                },
                {
                    id: "833f249c-1c9e-4761-a33a-3a3db158b696",
                    name: "elevation",
                    value: "={{ $json.elevation }}",
                    type: "number"
                },
                {
                    id: "371329a8-6fc2-40da-a44f-a2e0ecf85799",
                    name: "lat",
                    value: "={{ $json.lat }}",
                    type: "string"
                },
                {
                    id: "d9e3c9b4-6d08-4581-93b6-1b71c7196349",
                    name: "lon",
                    value: "={{ $json.lon }}",
                    type: "string"
                },
                {
                    id: "9cfcc07f-8fd5-4cfa-a27d-6a806c49347b",
                    name: "county",
                    value: "={{ $json.county }}",
                    type: "string"
                },
                {
                    id: "99dbf8a6-c1f3-45ed-9455-ea17598b8caf",
                    name: "customer_id",
                    value: "={{ $json.customer_id }}",
                    type: "string"
                },
                {
                    id: "47501d91-0e4d-4484-b987-e06c59997b52",
                    name: "order_id",
                    value: "={{ $json.order_id }}",
                    type: "string"
                },
                {
                    id: "363501e4-e192-4890-b57f-ab723cc2a53a",
                    name: "geometry",
                    value: "={{ $json.geometry }}",
                    type: "object"
                },
                {
                    id: "dd033ec8-237e-4e04-9004-623914baa468",
                    name: "fields.gisacre",
                    value: "={{ $('HTTP Request').item.json.fields.gisacre }}",
                    type: "number"
                }
            ]
        },
        options: {
            dotNotation: true
        }
    };

    @node({
        id: "dcebec96-dd08-44c0-8e2b-8c0ba0922058",
        name: "Code1",
        type: "n8n-nodes-base.code",
        version: 2,
        position: [-1808, -48]
    })
    Code1 = {
        jsCode: `// Input JSON containing the geometry and coordinates
const input = items[0].json;
const coordinates = $input.first().json.geometry.coordinates[0];  // Access the first ring of the Polygon

const color = "0xffff00ff";
const weight = 4;

// Helper function to create the path string with rounded numbers
function createPathString(coordinates) {
  return coordinates.map(coord => {
    const lat = Number(coord[1]).toFixed(7); // Convert to number, round to 7 decimals
    const lon = Number(coord[0]).toFixed(7); // Convert to number, round to 7 decimals
    return \`\${lat},\${lon}\`;
  }).join('|');  // Reverse lat/lon
}

// Build the path string
const pathString = \`path=color:\${color}|weight:\${weight}|\${createPathString(coordinates)}\`;

// Return the result
return [{ json: { pathString: pathString } }];`
    };

    @node({
        id: "ec788af8-ac25-4272-876d-c34b80a7518d",
        name: "Edit Fields1",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [-1360, -48]
    })
    EditFields1 = {
        assignments: {
            assignments: [
                {
                    id: "68a6db1a-891e-48fe-9f8e-52f6b1e92a6e",
                    name: "acres",
                    value: "={{ $json.acres }}",
                    type: "number"
                },
                {
                    id: "86c320a1-3e81-4e96-8028-c2b360c911af",
                    name: "owner",
                    value: "={{ $('Edit Fields9').item.json.owner }}",
                    type: "string"
                },
                {
                    id: "369090e7-3df2-451b-b0df-8a21951a35e1",
                    name: "elevation",
                    value: "={{ $('Edit Fields9').item.json.elevation }}",
                    type: "number"
                },
                {
                    id: "ccbe62f6-31f1-4c54-bbc8-f5471615c971",
                    name: "lat",
                    value: "={{ $('Edit Fields9').item.json.lat }}",
                    type: "number"
                },
                {
                    id: "cc988a98-9a90-474a-be5b-a1988bddac86",
                    name: "lon",
                    value: "={{ $('Edit Fields9').item.json.lon }}",
                    type: "number"
                },
                {
                    id: "98d5ce07-c629-4329-a75e-c1b4a00df470",
                    name: "county",
                    value: "={{ $('Edit Fields9').item.json.county }}",
                    type: "string"
                },
                {
                    id: "ae8a5ec6-c344-4b65-a8bc-f5e4b12223a1",
                    name: "customer_id",
                    value: "={{ $('Edit Fields9').item.json.customer_id }}",
                    type: "string"
                },
                {
                    id: "6e88832b-b8a4-440b-b7a0-b5455cb8cad1",
                    name: "order_id",
                    value: "={{ $('Edit Fields9').item.json.order_id }}",
                    type: "string"
                },
                {
                    id: "7ef0cb01-ec6b-4b28-916e-bda06b82074b",
                    name: "geometry",
                    value: "={{ $('Edit Fields9').item.json.geometry }}",
                    type: "object"
                },
                {
                    id: "c33cc601-a399-4bfc-b167-6ee2a7677468",
                    name: "srcmap",
                    value: "={{ $('Edit Fields8').item.json.srcmap }}",
                    type: "string"
                },
                {
                    id: "e43cd9a6-6166-4204-aaa7-bffac3644e26",
                    name: "",
                    value: "",
                    type: "string"
                }
            ]
        },
        options: {
            dotNotation: true
        }
    };

    @node({
        id: "fd158265-2008-4ef4-8ea4-f58a2436c993",
        webhookId: "d4974609-6a46-45bc-8230-d5fc3fdb580c",
        name: "Dispatch a workflow event and wait for completion",
        type: "n8n-nodes-base.github",
        version: 1.1,
        position: [-1136, -48],
        credentials: {githubApi:{id:"WAVhETF4rbadk9yF",name:"GitHub account"}}
    })
    DispatchAWorkflowEventAndWaitForCompletion = {
        resource: "workflow",
        operation: "dispatchAndWait",
        owner: {
            __rl: true,
            value: "ditchallaway",
            mode: "list",
            cachedResultName: "ditchallaway",
            cachedResultUrl: "https://github.com/ditchallaway"
        },
        repository: {
            __rl: true,
            value: "Robotic-Property-Photographer",
            mode: "list",
            cachedResultName: "Robotic-Property-Photographer",
            cachedResultUrl: "https://github.com/ditchallaway/Robotic-Property-Photographer"
        },
        workflowId: {
            __rl: true,
            value: 262111778,
            mode: "list",
            cachedResultName: "Snapshots"
        },
        ref: {
            __rl: true,
            value: "main",
            mode: "list",
            cachedResultName: "main"
        },
        inputs: "={{ JSON.stringify({ job_json: JSON.stringify($json) }) }}"
    };

    @node({
        id: "60e090b9-7a6c-471d-a390-08d100de8cd5",
        name: "HTTP Request2",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [-912, -48]
    })
    HttpRequest2 = {
        url: "=https://api.github.com/repos/ditchallaway/robotic-property-photographer/actions/runs/{{ $json.run_id }}/artifacts",
        options: {}
    };

    @node({
        id: "cbc90dc4-efc4-4a4c-a695-1e46ab845263",
        name: "HTTP Request3",
        type: "n8n-nodes-base.httpRequest",
        version: 4.4,
        position: [-688, -48],
        credentials: {githubApi:{id:"WAVhETF4rbadk9yF",name:"GitHub account"}}
    })
    HttpRequest3 = {
        url: "={{ $json.artifacts[0].archive_download_url }}",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "githubApi",
        options: {}
    };

    @node({
        id: "ed5eb1ed-a379-4064-8644-11da8263ae40",
        name: "Compression",
        type: "n8n-nodes-base.compression",
        version: 1.1,
        position: [-464, -48]
    })
    Compression = {
        outputPrefix: "="
    };

    @node({
        id: "b286f6f0-4d55-4996-830b-9ed917aa1a5e",
        name: "Code in JavaScript",
        type: "n8n-nodes-base.code",
        version: 2,
        position: [-240, -48]
    })
    CodeInJavascript = {
        jsCode: `const items = [];
for (const item of $input.all()) {
  for (const key of Object.keys(item.binary)) {
    items.push({
      json: {
        ...item.json,
        fileName: item.binary[key].fileName
      },
      binary: {
        data: item.binary[key]
      }
    });
  }
}
return items;`
    };

    @node({
        id: "109cbc83-2967-47db-8947-cbac80d1a449",
        name: "Upload a file",
        type: "n8n-nodes-base.s3",
        version: 1,
        position: [-16, -48],
        credentials: {s3:{id:"1GusURtMq14SbO6K",name:"btx-store-bucket"}}
    })
    UploadAFile = {
        operation: "upload",
        bucketName: "btx-store",
        fileName: "={{ $('Edit Fields1').item.json.customer_id }}/{{ $('Edit Fields1').item.json.order_id }}/{{ $json.fileName }}",
        additionalFields: {}
    };

    @node({
        id: "59bce36f-c5d7-4d7e-84c3-fe535c1f1925",
        name: "Edit Fields2",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [432, -48]
    })
    EditFields2 = {
        assignments: {
            assignments: [
                {
                    id: "e0230557-51e0-480a-902e-a7db19187952",
                    name: "customer_id",
                    value: "={{ $('Edit Fields9').item.json.customer_id }}",
                    type: "string"
                },
                {
                    id: "645ef0e8-eba0-40f0-a5d0-4cb73b2514ed",
                    name: "order_id",
                    value: "={{ $('Edit Fields9').item.json.order_id }}",
                    type: "string"
                },
                {
                    id: "010529f8-ad41-4e80-ad97-837021971818",
                    name: "product_id",
                    value: "full",
                    type: "string"
                },
                {
                    id: "ad75eb23-304b-4fad-aef6-57be26f05d0c",
                    name: "acreage",
                    value: "={{ $('Edit Fields1').item.json.acres }}",
                    type: "number"
                },
                {
                    id: "fe722463-ee2c-448f-ae8d-e8f6ed6bca48",
                    name: "imageUrl",
                    value: "={{ $json.imageUrl }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "a415ac96-ce78-4234-9574-96d007f2bd1a",
        name: "Sticky Note1",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [-2976, -160]
    })
    StickyNote1 = {
        content: `## 🚩Replace Me
**Replace** With webhook node.`,
        height: 272,
        width: 192,
        color: "#477D40"
    };

    @node({
        id: "349d7f61-fea5-400f-8ac3-66d0a3e7790d",
        name: "Sticky Note2",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [-2752, -160]
    })
    StickyNote2 = {
        content: `## 🚩Replace Me
**Replace** With actual api endpoint`,
        height: 272,
        width: 192,
        color: "#477D40"
    };

    @node({
        id: "1510e24a-b6e6-4fdb-8971-8294f439774b",
        name: "Edit Fields3",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [208, -48]
    })
    EditFields3 = {
        assignments: {
            assignments: [
                {
                    id: "d596049d-c49b-4128-a169-e36e268497ce",
                    name: "imageUrl",
                    value: "=https://pics.brokertricks.com/{{ $('Edit Fields9').item.json.customer_id }}/{{ $('Edit Fields9').item.json.order_id }}/{{ $('Code in JavaScript').item.json.fileName }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "d2a39ae3-7387-4178-b634-62947b19ef81",
        name: "Sticky Note",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [-1184, -240]
    })
    StickyNote = {
        height: 352,
        width: 192,
        color: 4
    };

    @node({
        id: "86111bf4-e49e-43e8-962d-f759220c0b3c",
        name: "all images url builder",
        type: "n8n-nodes-base.code",
        version: 2,
        position: [656, -48]
    })
    AllImagesUrlBuilder = {
        jsCode: `const items = $input.all();
const input = items[0].json;

const customer_id = input.customer_id || 'cust_12345';
const order_id = input.order_id || 'order_12345';

let acreage = 0;
try {
    acreage = $('Edit Fields1').first().json.acres;
} catch(e) {
    acreage = input.acreage || 0;
}

// Dynamically build files array from all incoming items
// Filter out reference images — they are srcmap downloads, not property shots
const timestamp = Date.now();
const files = [];
for (const item of items) {
  if (item.json.imageUrl && !item.json.imageUrl.includes('reference_')) {
    files.push(\`\${item.json.imageUrl}?t=\${timestamp}\`);
  }
}

// Fallback in case no imageUrls were passed
if (files.length === 0) {
  files.push(\`https://pics.brokertricks.com/\${customer_id}/\${order_id}/property_overhead.png?t=\${timestamp}\`);
}

const webhookUrl = \`https://auto.brokertricks.com/webhook/bucket?customer_id=\${customer_id}&order_id=\${order_id}&direction=full\`;

// Build ExtendScript that loops over ALL open documents
// Photopea opens each file as a separate tab — we must iterate
// through every document to add the acreage text layer to each one.
const script = \`\\nvar acreageText = "\${acreage} ACRES";
var expectedFiles = \${files.length};

if (app.documents.length === expectedFiles) {
  for (var i = 0; i < app.documents.length; i++) {
    var doc = app.documents[i];
    
    var hasLayer = false;
    for (var j = 0; j < doc.artLayers.length; j++) {
      if (doc.artLayers[j].kind == LayerKind.TEXT) {
        hasLayer = true;
        break;
      }
    }
    
    if (!hasLayer) {
      app.activeDocument = doc;
      var textLayer = doc.artLayers.add();
      textLayer.kind = LayerKind.TEXT;
      textLayer.textItem.contents = acreageText;
      textLayer.textItem.size = 120;
      
      var col = new SolidColor();
      col.rgb.hexValue = "FFFF00";
      textLayer.textItem.color = col;
      textLayer.textItem.position = [100, 200];
    }
  }
}\\n\`.trim();

const payload = {
    files: files,
    server: {
        url: webhookUrl,
        formats: ["png"]
    },
    script: script
};

const encodedConfig = encodeURIComponent(JSON.stringify(payload));

// Add query params for the dashboard UI, and the hash for Photopea
const params = [
  \`customer_id=\${encodeURIComponent(customer_id)}\`,
  \`order_id=\${encodeURIComponent(order_id)}\`,
  \`direction=full\`,
  \`acreage=\${encodeURIComponent(acreage)}\`
];
const editorUrl = \`https://app.brokertricks.com/editor-full.html?\${params.join('&')}#\${encodedConfig}\`;

// We only need to output a single item containing the combined URL
return [
  {
    json: {
      ...input,
      editorUrl: editorUrl,
      photopeaPayload: payload,
      filesIncluded: files.length
    }
  }
];`
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.WhenClickingExecuteWorkflow.out(0).to(this.HttpRequest.in(0));
        this.HttpRequest.out(0).to(this.HttpRequest1.in(0));
        this.EditFields.out(0).to(this.EditFields9.in(0));
        this.HttpRequest1.out(0).to(this.EditFields.in(0));
        this.EditFields8.out(0).to(this.EditFields1.in(0));
        this.EditFields9.out(0).to(this.Code1.in(0));
        this.Code1.out(0).to(this.EditFields8.in(0));
        this.EditFields1.out(0).to(this.DispatchAWorkflowEventAndWaitForCompletion.in(0));
        this.DispatchAWorkflowEventAndWaitForCompletion.out(0).to(this.HttpRequest2.in(0));
        this.HttpRequest2.out(0).to(this.HttpRequest3.in(0));
        this.HttpRequest3.out(0).to(this.Compression.in(0));
        this.Compression.out(0).to(this.CodeInJavascript.in(0));
        this.CodeInJavascript.out(0).to(this.UploadAFile.in(0));
        this.UploadAFile.out(0).to(this.EditFields3.in(0));
        this.EditFields2.out(0).to(this.AllImagesUrlBuilder.in(0));
        this.EditFields3.out(0).to(this.EditFields2.in(0));
    }
}