"use server";

import { graphql } from "graphql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createGraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

type DeleteProjectState = {
  error: string | null;
};

export async function deleteProjectAction(
  projectId: string,
  _previousState: DeleteProjectState,
  _formData: FormData,
): Promise<DeleteProjectState> {
  void _previousState;
  void _formData;

  try {
    const result = await graphql({
      schema,
      source: `
                mutation DeleteProject($id: ID!) {
                    deleteProject(id: $id)
                }
            `,
      variableValues: { id: projectId },
      contextValue: await createGraphQLContext(),
    });

    if (result.errors?.length) {
      const error = result.errors[0];

      if (error.extensions.code === "NOT_FOUND") {
        return { error: "Project not found." };
      }

      console.error("Project deletion failed:", result.errors);
      return {
        error: "Unable to delete the project. Please try again.",
      };
    }
  } catch (err) {
    console.error("Project deletion failed:", err);
    return {
      error: "Unable to delete the project. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
