import { Data } from "effect";

/** A failed storage request, retaining the underlying SDK error for diagnostics. */
export class StorageError extends Data.TaggedError("StorageError")<{
  operation: "put" | "getUrl" | "delete";
  key: string;
  cause: unknown;
}> {}
