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
            type: String
           }
        ],
        heatnessLevel: 
            [
                {
                    type: String
                }
            ]

        ,
        categories:[
            {
                type: String
            }
        ]
            
        
    },
    customers:{
        groups: [
            {
                group:{
                    type: String
                }
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
              leaveAccrualType: {
                type: String,
              },
              carryForward: {
                type: String,
              },
              carryForwardType: {
                type: String,
              },
              numberOfDays:{
                type: Number
              },
              leaveType:{
                type:String
              },
              createdBy: {
                type: String,
              },
              dateCreated: {
                type: Date,
              },
              updatedBy: {
                type: String,
              },
              updatedAt: {
                type: Date,
              },
            },
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
                decimalSeparator:{
                    type: String
                },
         
                thousandSeparator:{
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
    ],
    assets: {
        asset:[
        {
          item: { type: String, required: true },
          quantity: { type: Number, required: true },
          notes: { type: String, required: false },
        },
    ]
},
  tags:{
    tag:[
        {tagName:{
        type: String
    }
  }]
  }

   
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