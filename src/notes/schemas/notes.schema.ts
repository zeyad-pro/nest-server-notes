
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
export type NoteDocument = HydratedDocument<Note>;

@Schema({timestamps: true})
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  des: string;

  @Prop({ required: true })
  color: string;
  
 
@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
user: MongooseSchema.Types.ObjectId; // ربط النوتة بصاحبها
  
 
}

export const notesSchema = SchemaFactory.createForClass(Note);
