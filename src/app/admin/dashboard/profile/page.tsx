
import { ProfileForm } from "@/components/admin/profile-form";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfileAdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil Personnel</CardTitle>
                <CardDescription>Gérez les informations de base de votre CV. Ces informations seront visibles publiquement.</CardDescription>
            </CardHeader>
            <ProfileForm />
        </Card>
    )
}
