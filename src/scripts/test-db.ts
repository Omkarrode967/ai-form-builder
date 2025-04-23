import { db } from "@/db";
import { forms, questions, fieldOptions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

async function testDatabase() {
  console.log("Starting database test...");
  
  try {
    // Test 1: Check if we can connect to the database
    console.log("Test 1: Checking database connection...");
    const result = await db.execute(sql`SELECT 1`);
    console.log("✅ Database connection successful");
    
    // Test 2: Insert a test form
    console.log("\nTest 2: Inserting a test form...");
    const formId = uuidv4();
    const testForm = {
      formID: formId,
      user_prompt: "Test form prompt",
      name: "Test Form",
      description: "This is a test form",
      userId: "test-user-id",
      published: false
    };
    
    const insertedForm = await db.insert(forms).values(testForm).returning();
    console.log("✅ Test form inserted successfully:", insertedForm[0]);
    
    // Test 3: Insert test questions
    console.log("\nTest 3: Inserting test questions...");
    const testQuestions = [
      {
        text: "Test Question 1",
        fieldType: "Input" as const,
        formId: insertedForm[0].id
      },
      {
        text: "Test Question 2",
        fieldType: "RadioGroup" as const,
        formId: insertedForm[0].id
      }
    ];
    
    const insertedQuestions = await db.insert(questions).values(testQuestions).returning();
    console.log("✅ Test questions inserted successfully:", insertedQuestions);
    
    // Test 4: Insert test field options
    console.log("\nTest 4: Inserting test field options...");
    const testFieldOptions = [
      {
        text: "Option 1",
        value: "option1",
        questionId: insertedQuestions[1].id
      },
      {
        text: "Option 2",
        value: "option2",
        questionId: insertedQuestions[1].id
      }
    ];
    
    const insertedFieldOptions = await db.insert(fieldOptions).values(testFieldOptions).returning();
    console.log("✅ Test field options inserted successfully:", insertedFieldOptions);
    
    // Test 5: Retrieve the test form with questions and field options
    console.log("\nTest 5: Retrieving the test form with questions and field options...");
    const retrievedForm = await db.query.forms.findFirst({
      where: eq(forms.id, insertedForm[0].id),
      with: {
        questions: {
          with: {
            fieldOptions: true
          }
        }
      }
    });
    
    console.log("✅ Test form retrieved successfully:", JSON.stringify(retrievedForm, null, 2));
    
    // Test 6: Clean up - Delete the test data
    console.log("\nTest 6: Cleaning up test data...");
    await db.delete(fieldOptions).where(eq(fieldOptions.questionId, insertedQuestions[1].id));
    await db.delete(questions).where(eq(questions.formId, insertedForm[0].id));
    await db.delete(forms).where(eq(forms.id, insertedForm[0].id));
    console.log("✅ Test data cleaned up successfully");
    
    console.log("\n✅ All database tests passed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the test
testDatabase(); 