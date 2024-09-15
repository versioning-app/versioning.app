import { AdHocPermissionEvaluator } from '../ad-hoc-permission-evaluator';
import {
  evaluatePermission,
  fetchRoles,
  fetchAvailableResources,
} from '../actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function PermissionsEvaluator() {
  return (
    <Card className="bg-background border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          Ad-hoc Permission Evaluation
        </CardTitle>
        <CardDescription>
          Evaluate permissions for specific resources, actions, and roles in
          real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdHocPermissionEvaluator
          evaluatePermission={evaluatePermission}
          fetchRoles={fetchRoles}
          fetchAvailableResources={fetchAvailableResources}
        />
      </CardContent>
    </Card>
  );
}
