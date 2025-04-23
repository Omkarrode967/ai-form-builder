export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Welcome to IntelliForm</h2>
        <p className="text-muted-foreground">
          Create, manage, and analyze your forms with ease.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Quick Actions</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Use the form generator above to create a new form, or view your existing forms in the sidebar.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Recent Forms</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Your recently created forms will appear here.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-muted-foreground mt-2">
            View insights and statistics about your forms.
          </p>
        </div>
      </div>
    </div>
  );
} 