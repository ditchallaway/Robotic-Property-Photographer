import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : new-order
// Nodes   : 9  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook                    
// StickyNote                         stickyNote                 
// HttpRequest                        httpRequest                [creds]
// Switch_                            switch                     
// HttpRequest1                       httpRequest                
// HttpRequest3                       httpRequest                [creds]
// HttpRequest4                       httpRequest                [creds]
// GetManyUsers                       wordpress                  [creds]
// EditFields                         set                        
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → HttpRequest4
//      → GetManyUsers
//        → EditFields
//          → Switch_
//            → HttpRequest1
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "NxcEiPloqLn1EJ87",
    name: "new-order",
    active: true,
    isArchived: false,
    projectId: "SxZfT7rxAv9cKdRm",
    settings: { executionOrder: "v1", callerPolicy: "workflowsFromSameOwner", availableInMCP: false, binaryMode: "separate" }
})
export class NewOrderWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        id: "1202c937-1d99-481f-8e6a-2ce76e85e811",
        webhookId: "0ccdd082-8344-4377-9f4e-55d03d5029a0",
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        version: 2.1,
        position: [-704, 80]
    })
    Webhook = {
        httpMethod: "POST",
        path: "new-order",
        responseMode: "lastNode",
        options: {}
    };

    @node({
        id: "679fbb5a-5817-4b54-83f9-f5aaf9ef6ef4",
        name: "Sticky Note",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [-288, -176]
    })
    StickyNote = {
        content: `## Product Id's
| Product | . | ID |
|---:|---|---|
| **Single Image** | .... | 69e6ffdb-d671-4309-a9d9-78fdef6d958a |
| **Single Full Story** | .... | 99a2075c-abd9-4b0d-b567-50467264151b |
| **Full Listing Kit** | .... | d082d9a3-90d3-41e3-8b6a-53e8b4572cf6 |


`,
        height: 224,
        width: 560
    };

    @node({
        id: "eba2f073-aa12-407b-bb62-cbdb763e213c",
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        version: 4.3,
        position: [384, -160],
        credentials: {httpBearerAuth:{id:"xhDXgP3FOrplGc9h",name:"get product id"}}
    })
    HttpRequest = {
        url: "=https://api.surecart.com/v1/orders/{{ $json.body.data.object.id }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpBearerAuth",
        options: {}
    };

    @node({
        id: "e3f39d65-5172-4beb-80c0-92296ae8fb8a",
        name: "Switch",
        type: "n8n-nodes-base.switch",
        version: 3.3,
        position: [192, 80]
    })
    Switch_ = {
        rules: {
            values: [
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: "",
                            typeValidation: "strict",
                            version: 2
                        },
                        conditions: [
                            {
                                leftValue: "",
                                rightValue: " bb3c33ae-36bc-488d-809e-166665ad7fe6",
                                operator: {
                                    type: "string",
                                    operation: "equals"
                                },
                                id: "656adc4d-1f78-4445-bebe-b6cd65b2b531"
                            }
                        ],
                        combinator: "and"
                    },
                    renameOutput: true,
                    outputKey: "single image"
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: "",
                            typeValidation: "strict",
                            version: 2
                        },
                        conditions: [
                            {
                                id: "a7615221-b164-40cb-9df2-0540db1fdc75",
                                leftValue: "",
                                rightValue: "69e6ffdb-d671-4309-a9d9-78fdef6d958a",
                                operator: {
                                    type: "string",
                                    operation: "equals",
                                    name: "filter.operator.equals"
                                }
                            }
                        ],
                        combinator: "and"
                    },
                    renameOutput: true,
                    outputKey: "single full"
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: "",
                            typeValidation: "strict",
                            version: 2
                        },
                        conditions: [
                            {
                                id: "6911a445-1c99-401e-9e79-121a5226a192",
                                leftValue: "",
                                rightValue: "d082d9a3-90d3-41e3-8b6a-53e8b4572cf6",
                                operator: {
                                    type: "string",
                                    operation: "equals",
                                    name: "filter.operator.equals"
                                }
                            }
                        ],
                        combinator: "and"
                    },
                    renameOutput: true,
                    outputKey: "listing pack"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "bb06c8b8-cd67-4b91-b3b2-12ebf8e75ea3",
        name: "HTTP Request1",
        type: "n8n-nodes-base.httpRequest",
        version: 4.3,
        position: [448, 16]
    })
    HttpRequest1 = {
        url: "https://auto.brokertricks.com/webhook/proto-image-gen",
        options: {}
    };

    @node({
        id: "3e1b5f18-b96d-4807-ac9a-984acea5dba3",
        name: "HTTP Request3",
        type: "n8n-nodes-base.httpRequest",
        version: 4.3,
        position: [656, -144],
        credentials: {httpBearerAuth:{id:"fs3UN7UYgrHE4ads",name:"surecart"}}
    })
    HttpRequest3 = {
        url: "=https://api.surecart.com/v1/customers/{{ $json.checkout.customer.id }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpBearerAuth",
        sendQuery: true,
        queryParameters: {
            parameters: [
                {
                    name: "expand[]",
                    value: "customer"
                }
            ]
        },
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: "expand[]",
                    value: "customer"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "6bda556d-3d33-4e87-ae3d-f0a1f3a1ab74",
        name: "HTTP Request4",
        type: "n8n-nodes-base.httpRequest",
        version: 4.3,
        position: [-496, 80],
        credentials: {httpBearerAuth:{id:"fs3UN7UYgrHE4ads",name:"surecart"}}
    })
    HttpRequest4 = {
        url: "=https://api.surecart.com/v1/orders/{{ $json.body.data.object.id }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpBearerAuth",
        sendBody: true,
        contentType: "multipart-form-data",
        bodyParameters: {
            parameters: [
                {
                    name: "expand[]",
                    value: "checkout"
                },
                {
                    name: "expand[]",
                    value: "checkout.customer"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "5abad326-5355-45b6-a1c8-699d9ddcbc0f",
        name: "Get many users",
        type: "n8n-nodes-base.wordpress",
        version: 1,
        position: [-288, 80],
        credentials: {wordpressApi:{id:"LARssrhxqUVVlkOR",name:"get wp user"}}
    })
    GetManyUsers = {
        resource: "user",
        operation: "getAll",
        limit: 1,
        options: {
            search: "={{ $json.checkout.customer.email }}"
        }
    };

    @node({
        id: "273feb1e-dbda-45dc-b00a-5855ec15cfba",
        name: "Edit Fields",
        type: "n8n-nodes-base.set",
        version: 3.4,
        position: [-80, 80]
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: "15cf273e-062c-4a60-954c-e6939f943165",
                    name: "wpuser_id",
                    value: "={{ $json.id }}",
                    type: "string"
                },
                {
                    id: "f94a3ebb-b2ba-4cf4-8af1-fa68159a59de",
                    name: "email",
                    value: "={{ $json.name }}",
                    type: "string"
                },
                {
                    id: "bb94a86b-3f59-4497-b3ea-4a838a74da70",
                    name: "order_id",
                    value: "={{ $('HTTP Request4').item.json.id }}",
                    type: "string"
                },
                {
                    id: "4eea76de-1667-4d71-b2ed-314447def552",
                    name: "parcel_apn",
                    value: "={{ $('HTTP Request4').item.json.checkout.metadata.parcel }}",
                    type: "string"
                },
                {
                    id: "3cf83781-91f3-45f3-bb43-ab1eb238e897",
                    name: "latitude",
                    value: "={{ $('HTTP Request4').item.json.checkout.metadata.latInput }}",
                    type: "string"
                },
                {
                    id: "90ebb0c0-4ba3-4485-af09-d420f3369432",
                    name: "longitude",
                    value: "={{ $('HTTP Request4').item.json.checkout.metadata.lngInput }}",
                    type: "string"
                }
            ]
        },
        options: {}
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.HttpRequest4.in(0));
        this.Switch_.out(0).to(this.HttpRequest1.in(0));
        this.HttpRequest4.out(0).to(this.GetManyUsers.in(0));
        this.GetManyUsers.out(0).to(this.EditFields.in(0));
        this.EditFields.out(0).to(this.Switch_.in(0));
    }
}