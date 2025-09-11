
import { SkillsForm } from "@/components/admin/skills-form";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SkillsAdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Compétences</CardTitle>
                <CardDescription>Gérez les catégories et les compétences affichées sur votre CV.</CardDescription>
            </CardHeader>
            <SkillsForm />
        </Card>
    )
}
