
import { ProjectsForm } from "@/components/admin/projects-form";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProjectsAdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Projets</CardTitle>
                <CardDescription>Gérez les projets affichés sur votre CV. Vous pouvez les réorganiser par glisser-déposer.</CardDescription>
            </CardHeader>
            <ProjectsForm />
        </Card>
    )
}
