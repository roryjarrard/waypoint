"use server";

import { graphql } from "graphql";
import { revalidatePath } from "next/cache";

import { createGraphQLContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

export async function updateProjectAction(
  projectId: string,
  _previousState: { error: string | null; saved: boolean },
  formData: FormData,
): Promise<{ error: string | null; saved: boolean }> {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || typeof description !== "string") {
    return { error: "Invalid project form submission.", saved: false };
  }

  const result = await graphql({
    schema,
    source: `mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
      updateProject(id: $id, input: $input) { id }
    }`,
    variableValues: { id: projectId, input: { name, description } },
    contextValue: await createGraphQLContext(),
  });

  if (result.errors?.length) {
    const error = result.errors[0];
    const expected = ["BAD_USER_INPUT", "NOT_FOUND"].includes(
      String(error.extensions.code),
    );
    if (!expected) {
      console.error("Project update failed", result.errors);
    }
    return {
      error: expected
        ? error.message
        : "Unable to save the project. Please try again.",
      saved: false,
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
  return { error: null, saved: true };
}
