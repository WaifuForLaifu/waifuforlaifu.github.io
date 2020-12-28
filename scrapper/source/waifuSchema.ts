import { Document, model, Schema } from 'mongoose';

interface waifuSchemaTypes extends Document {
    _id: number // Mal ID
    name: string
    anime: string // Series name
}

const waifuSchema: Schema = new Schema(
    {
        _id: {type: Number, required: true},
        name: {type: String, required: true},
        anime: {type: String, required: true},
    },
    {versionKey: false}
);

export default model<waifuSchemaTypes>('waifus', waifuSchema);