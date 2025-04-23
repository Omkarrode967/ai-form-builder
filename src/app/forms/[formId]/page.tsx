import React from "react";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import Form from "../Form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const page = async ({
  params,
}: {
  params: {
    formId: string;
  };
}) => {
  const formId = params.formId;

  if (!formId) {
    return <div>Form not found</div>;
  }

  const form = await db.query.forms.findFirst({
    where: eq(forms.formID, formId),
    with: {
      questions: {
        with: {
          fieldOptions: true,
        },
      },
    },
  });

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div>
      <div className="p-4">
        <Link href="/view-forms">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to My Forms
          </Button>
        </Link>
      </div>
      <Form form={form} />
    </div>
  );
};
export default page;
