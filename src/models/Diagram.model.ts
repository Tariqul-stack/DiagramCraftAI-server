import { Schema, model, Document, Types } from 'mongoose';

export type DiagramType = 'flowchart' | 'sequence' | 'erd' | 'class' | 'mindmap' | 'gantt';
export type DiagramCategory = 'business' | 'tech' | 'education' | 'personal';
export type DiagramVisibility = 'public' | 'private';

export interface IDiagram extends Document {
  title: string;
  description?: string;
  mermaidCode: string;
  prompt?: string;
  diagramType: DiagramType;
  category: DiagramCategory;
  tags: string[];
  visibility: DiagramVisibility;
  author: Types.ObjectId;
  likeCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const diagramSchema = new Schema<IDiagram>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mermaidCode: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
    },
    diagramType: {
      type: String,
      enum: ['flowchart', 'sequence', 'erd', 'class', 'mindmap', 'gantt'],
      required: true,
    },
    category: {
      type: String,
      enum: ['business', 'tech', 'education', 'personal'],
      default: 'tech',
    },
    tags: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model<IDiagram>('Diagram', diagramSchema);
