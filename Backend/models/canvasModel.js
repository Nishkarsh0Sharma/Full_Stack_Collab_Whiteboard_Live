const mongoose = require("mongoose");

const CanvasSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who created canvas
      required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100, // optional: limit name length
    },

    elements: {
        type: [mongoose.Schema.Types.Mixed], // Array of Mixed type
        default: [], // optional, so it starts as empty array
    },


    shared_with: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // list of users the canvas is shared with
      },
    ],

    last_modified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who last modified the canvas
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);


//Get all canvases for a user noth owned and shared with
CanvasSchema.statics.getAllCanvases = async function(email) {
    try {
        const user = await mongoose.model('User').findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Find canvases where the user is either the owner or in shared_with
        const canvases = await this.find({
            $or: [
                { owner: user._id },
                { shared_with: user._id }
            ]
        })
        .populate('owner', 'name email') // Populate owner details
        .populate('shared_with', 'name email') // Populate shared users details
        .sort({ updatedAt: -1 }); // Most recently updated first

        // If no canvases found, return empty array (not an error)
        return canvases;
    } catch (error) {
        throw new Error('Failed to retrieve canvases: ' + error.message);
    }
};


//create a canvas for a user with given email
CanvasSchema.statics.createCanvas = async function(email, name) {
    try {
        const user = await mongoose.model('User').findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const newCanvas = new this({
            owner: user._id,
            name: name,
            elements: []
        });

        await newCanvas.save();
        return newCanvas;
    } catch (error) {
        throw new Error('Failed to create canvas: ' + error.message);
    }
};

CanvasSchema.statics.loadCanvas = async function(email, id) {
    try {
        const user = await mongoose.model('User').findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const canvas = await this.findOne({
            _id: id,
            $or: [
                { owner: user._id },
                { shared_with: user._id }
            ]
        })
        .populate('owner', 'name email')
        .populate('shared_with', 'name email');

        if (!canvas) {
            throw new Error('Canvas not found');
        }

        return canvas;
    } catch (error) {
        throw new Error('Failed to load canvas: ' + error.message);
    }
};


CanvasSchema.statics.updateCanvas = async function(email,id, elements) {
    try {
        const user = await mongoose.model('User').findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const canvas = await this.findOne({
            _id: id,
            $or: [
                { owner: user._id },
                { shared_with: user._id }
            ]
        });

        if (!canvas) {
            throw new Error('Canvas not found');
        }

        // Update elements and last_modified_by
        canvas.elements = elements;
        canvas.last_modified_by = user._id;
        await canvas.save();

        return canvas;
    } catch (error) {
        throw new Error('Failed to update canvas: ' + error.message);
    }
}

CanvasSchema.statics.deleteCanvas = async function(email, id) {
    // Validate id first
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Canvas not found');
    }

    const user = await mongoose.model('User').findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    // Only owner can delete
    const canvas = await this.findOne({
        _id: id,
        owner: user._id
    });

    if (!canvas) {
        throw new Error('Canvas not found or user is not the owner');
    }

    // Use findByIdAndDelete instead of remove
    await this.findByIdAndDelete(id);

    return true;
};

//Add email to shared_with of a canvas
CanvasSchema.statics.shareCanvas = async function(ownerEmail, canvasId, shareEmail) {
    try {
        const owner = await mongoose.model('User').findOne({ email: ownerEmail });
        if (!owner) {
            throw new Error('Owner not found');
        }

        const shareUser = await mongoose.model('User').findOne({ email: shareEmail });
        if (!shareUser) {
            throw new Error('User to share with not found');
        }

        const canvas = await this.findOne({
            _id: canvasId,
            owner: owner._id
        });

        if (!canvas) {
            throw new Error('Canvas not found or user is not the owner');
        }

        // Avoid duplicate entries
        if (canvas.shared_with.includes(shareUser._id)) {
            throw new Error('Canvas already shared with this user');
        }

        canvas.shared_with.push(shareUser._id);
        await canvas.save();

        return canvas;
    } catch (error) {
        throw new Error('Failed to share canvas: ' + error.message);
    }
};


const Canvas = mongoose.model("Canvas", CanvasSchema);
module.exports = Canvas; 

