const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },  
    categories: { type: [String], required: true },
    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    deliveryTime: { type: String, required: true }, 
    employer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    jobType: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Open', 'Closed', 'Under Application', 'Completed'], 
      default: 'Open' 
    },
    portfolio: { type: String },
    evaluation: { type: String },

    escrowStatus: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Cancelled'], 
      default: 'Pending' 
    },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Completed', 'Cancelled'], 
      default: 'Pending' 
    },

    freelancerApplications: [
      {
        freelancer: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User' 
        },
        offerPrice: { type: Number, required: true },
        estimatedTime: { type: String, required: true },
        proposal: { type: String },
        portfolio: { type: String },
        status: { 
          type: String, 
          enum: ['Applied', 'Selected', 'Rejected'], 
          default: 'Applied' 
        },
      }
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
