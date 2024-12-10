const mongoose = require("mongoose")

const setupSchema = new mongoose.Schema({
    leads: {
        sources: [
            {
                type: String
            }
        ],
        status: [
           {
            statusName:{
                type: String
            },
            orderNo:{
                type: Number
            }
           }
        ],
        heatnessLevel: 
            [
                {
                    type: String
                }
            ]

        
            
        
    },
    customers:{
        groups: [
            {
                type: Object
            }
        ]
    },
    staffs:{
        designations: [
            {
              designation:{
                type: String
              },
              description:{
                type: String
              },
              createdBy:{
                type: String
              },
              updatedBy:{
                type: String
              },
              dateCreated:{
                type: Date
              },
              dateUpdated:{
                type: Date
              }
            }
        ],
        leaveTypes: [
            {
                name:{
                    type: String
                },
                type:{
                    type: String
                },
                remarks:{
                    type: String
                },
                leavePerYear:{
                    type: Number
                },
                createdBy:{
                    type: String
                },
                createdAt:{
                    type: Date
                },
                updatedBy:{
                    type: String
                },
                updatedAt:{
                    type: Date
                }
            }
        ],
        checklists:[
           {
            name:{
                type: String
            },
            description:{
                type: String
            },
            createdBy:{
                type: String
            },
            createdAt:{
                type: Date
            },
            updatedBy:{
                type: String
           },
           updatedAt:{
            type: Date
           }
           }
        ]

    },
    finance:{
        taxRates: [
            {
               taxName:{
                type: String
               },
               rate:{
                type: Number
               }
            }
        ],
        currencies: [
            {
                currencyCode:{
                    type: String
                },
                symbol:{
                    type: String
                },
                decimalSeperator:{
                    type: String
                },
                thousandSeperator:{
                    type: String
                },
                currencyPlacement:{
                    type: String
                }
            }
        ],
        paymentModes: [
            {
                paymentModeName:{
                    type: String
                },
                bankAccounts:{
                    type: String
                },
                active:{
                    type: Boolean
                },
                sba:{
                    type: Boolean
                },
                sbd:{
                    type: Boolean
                },
                io:{
                    type: Boolean
                },
                eo:{
                    type: Boolean
                }
            }
        ],
        expenseCatagories: [
            {
                categoryName:{
                    type: String
                },
                categoryDescription:{
                    type: String
                }
            }
        ]
    },
    roles:[
        {
            type: String
        }
    ]
})


// const leadSchema = new mongoose.Schema({

//         sources:[
//             {
//                 name: String
//             }
//         ],
//         status:[
//             {
//                 name:String,
//                 order:String
//             }
//         ]

// })


module.exports = mongoose.model("Setup", setupSchema)