"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserForms } from "@/app/actions/getUserForms";
import { InferSelectModel } from "drizzle-orm";
import { forms, formSubmissions } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {};

const AnalyticsPage = (props: Props) => {
  const [userForms, setUserForms] = useState<Array<InferSelectModel<typeof forms>>>([]);
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [formSubmissionsData, setFormSubmissionsData] = useState<Array<InferSelectModel<typeof formSubmissions>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getUserForms();
        setUserForms(forms);
        if (forms.length > 0) {
          setSelectedForm(forms[0].id);
        }
      } catch (err) {
        console.error("Error fetching forms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      if (!selectedForm) return;
      
      try {
        setLoading(true);
        // This would be replaced with an actual API call to get form submissions
        // For now, we'll simulate data
        const mockData = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          formId: selectedForm,
          submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          userId: `user-${i}`,
        }));
        
        setFormSubmissionsData(mockData);
      } catch (err) {
        console.error("Error fetching form submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormSubmissions();
  }, [selectedForm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Select
          value={selectedForm?.toString()}
          onValueChange={(value) => setSelectedForm(parseInt(value))}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a form" />
          </SelectTrigger>
          <SelectContent>
            {userForms.map((form) => (
              <SelectItem key={form.id} value={form.id.toString()}>
                {form.name || `Form ${form.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formSubmissionsData.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 10)} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 30) + 70}%</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5)}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 5) + 2} min</div>
                <p className="text-xs text-muted-foreground">
                  -{Math.floor(Math.random() * 2)} min from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 100) + 50}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20)} from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Submissions Summary</CardTitle>
                <CardDescription>
                  Overview of form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Submissions</span>
                    <span className="font-medium">{formSubmissionsData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-medium">{Math.floor(formSubmissionsData.length * 0.8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span className="font-medium">{Math.floor(formSubmissionsData.length * 0.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Abandoned</span>
                    <span className="font-medium">{Math.floor(formSubmissionsData.length * 0.1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Form Performance</CardTitle>
                <CardDescription>
                  Key metrics for your form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Completion Time</span>
                    <span className="font-medium">{Math.floor(Math.random() * 5) + 2} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop-off Rate</span>
                    <span className="font-medium">{Math.floor(Math.random() * 20)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Rate</span>
                    <span className="font-medium">{Math.floor(Math.random() * 40) + 30}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                View the most recent form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formSubmissionsData.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Submission #{submission.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      User: {submission.userId}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>
                Analyze how users interact with your forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">{Math.floor(Math.random() * 20) + 10} users</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage; 