"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bug, Shield } from "lucide-react";
import { useState } from "react";

export default function SQLiBaseSurUnion() {
  const [vulnerableInput, setVulnerableInput] = useState("");
  const [vulnerablePassword, setVulnerablePassword] = useState("");
  const [secureInput, setSecureInput] = useState("");
  const [securePassword, setSecurePassword] = useState("");
  const [vulnerableResult, setVulnerableResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [secureResult, setSecureResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [vulnerableLoading, setVulnerableLoading] = useState(false);
  const [secureLoading, setSecureLoading] = useState(false);

  const testVulnerable = async () => {
    setVulnerableLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: vulnerableInput,
          password: vulnerablePassword,
          mode: "vulnerable",
        }),
      });
      const data = await response.json();
      setVulnerableResult(data);
    } catch (error: unknown) {
      console.error("Erreur testVulnerable:", error);
      setVulnerableResult({ error: "Erreur de connexion" });
    }
    setVulnerableLoading(false);
  };

  const testSecure = async () => {
    setSecureLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: secureInput,
          password: securePassword,
          mode: "secure",
        }),
      });
      const data = await response.json();
      setSecureResult(data);
    } catch (error: unknown) {
      console.error("Erreur testSecure:", error);
      setSecureResult({ error: "Erreur de connexion" });
    }
    setSecureLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SQLi Basée sur les Commentaires</h1>
        <p className="text-muted-foreground">
          Démonstration d&apos;injection SQL basée sur les commentaires SQL avec
          une version vulnérable et une version sécurisée
        </p>
      </div>

      <Tabs defaultValue="vulnerable" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vulnerable" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Version Vulnérable
          </TabsTrigger>
          <TabsTrigger value="secure" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Version Sécurisée
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Bug className="h-5 w-5" />
                Version Vulnérable
              </CardTitle>
              <CardDescription>
                Cette version utilise la concaténation directe de chaînes SQL et
                permet l&apos;exploitation via l&apos;injection de commentaires
                SQL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nom d&apos;utilisateur
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="username"
                    value={vulnerableInput}
                    onChange={(e) => setVulnerableInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && testVulnerable()}
                  />
                  <Input
                    placeholder="password"
                    type="password"
                    value={vulnerablePassword}
                    onChange={(e) => setVulnerablePassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && testVulnerable()}
                  />
                  <Button onClick={testVulnerable} disabled={vulnerableLoading}>
                    {vulnerableLoading ? "Test..." : "Tester"}
                  </Button>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  Exemples d&apos;injection pour contourner
                  l&apos;authentification
                </AlertTitle>
                <AlertDescription className="space-y-1 text-xs mt-2">
                  
                  <div>
                    <strong>Username:</strong> <code>admin&apos;#</code> |
                    <strong> Password:</strong> (n&apos;importe quoi)
                    <br />
                    <span className="text-muted-foreground">
                      → Commentaire MySQL/MariaDB avec #
                    </span>
                  </div>
               
                </AlertDescription>
              </Alert>

              {vulnerableResult && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Résultat :</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(vulnerableResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                Version Sécurisée
              </CardTitle>
              <CardDescription>
                Cette version utilise des requêtes préparées et une validation
                stricte pour prévenir l&apos;injection via les commentaires SQL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nom d&apos;utilisateur
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="username"
                    value={secureInput}
                    onChange={(e) => setSecureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && testSecure()}
                  />
                  <Input
                    placeholder="password"
                    type="password"
                    value={securePassword}
                    onChange={(e) => setSecurePassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && testSecure()}
                  />
                  <Button onClick={testSecure} disabled={secureLoading}>
                    {secureLoading ? "Test..." : "Tester"}
                  </Button>
                </div>
              </div>

              <Alert className="border-green-600">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">
                  Protection active
                </AlertTitle>
                <AlertDescription className="space-y-1 text-xs mt-2">
                  <div>✓ Validation des entrées</div>
                  <div>✓ Requêtes préparées (Prepared Statements)</div>
                  <div>✓ Paramètres typés et échappés automatiquement</div>
                  <div>
                    ✓ Impossibilité d&apos;injecter des commentaires SQL
                  </div>
                  <div>✓ Filtrage des caractères spéciaux (-- # /* */)</div>
                  <div>✓ Messages d&apos;erreur génériques</div>
                </AlertDescription>
              </Alert>

              {secureResult && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Résultat :</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(secureResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
