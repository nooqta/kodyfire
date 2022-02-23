export enum ArtifactType {
  file,
}
export interface IArtifact {
  name: string;
  type: ArtifactType;
}
