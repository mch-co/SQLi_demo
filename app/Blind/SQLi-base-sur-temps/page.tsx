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
import { AlertCircle, Bug, Clock, Shield } from "lucide-react";
import { useState } from "react";

export default function SQLiBaseSurTemps() {
  const [vulnerableInput, setVulnerableInput] = useState("");
  const [secureInput, setSecureInput] = useState("");
  const [vulnerableResult, setVulnerableResult] = useState<{
    error?: string;
    success?: boolean;
    found?: boolean;
    count?: number;
    data?: unknown;
    query?: string;
    message?: string;
    executionTime?: number;
  } | null>(null);
  const [secureResult, setSecureResult] = useState<{
    error?: string;
    success?: boolean;
    data?: unknown;
    message?: string;
  } | null>(null);
  const [vulnerableLoading, setVulnerableLoading] = useState(false);
  const [secureLoading, setSecureLoading] = useState(false);

  const testVulnerable = async () => {
    setVulnerableLoading(true);
    try {
      const response = await fetch("/api/sqli-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: vulnerableInput }),
      });
      const data = await response.json();
      setVulnerableResult(data);
    } catch {
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
    } catch {
      setSecureResult({ error: "Erreur de connexion" });
    }
    setSecureLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          SQLi Basée sur le Temps (Time-based Blind SQLi)
        </h1>
        <p className="text-muted-foreground">
          Démonstration d&apos;injection SQL aveugle basée sur les délais de
          réponse avec une version vulnérable et une version sécurisée
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
                Cette version utilise la concaténation directe et permet
                l&apos;exploitation via des délais temporels
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
                  Exemples d&apos;injection basée sur le temps (Time-based SQLi
                  - MariaDB)
                </AlertTitle>
                <AlertDescription className="space-y-1 text-xs mt-2">
                  <div>
                    <code>1 AND SLEEP(5)</code> - Délai de 5 secondes si vrai
                  </div>
                  <div>
                    <code>1 AND IF(1=1,SLEEP(5),0)</code> - Délai conditionnel
                  </div>
                  <div>
                    <code>
                      1 AND
                      IF(SUBSTRING(database(),1,1)=&apos;s&apos;,SLEEP(5),0)
                    </code>{" "}
                    - Test du nom de la DB
                  </div>
                  <div>
                    <code>1 AND IF(LENGTH(database())=9,SLEEP(5),0)</code> -
                    Test de longueur
                  </div>
                  <div>
                    <code>
                      1 AND IF(ASCII(SUBSTRING((SELECT username FROM users LIMIT
                      1),1,1))&gt;97,SLEEP(3),0)
                    </code>{" "}
                    - Extraction par ASCII
                  </div>
                </AlertDescription>
              </Alert>

              {vulnerableResult && (
                <div className="space-y-2">
                  {vulnerableResult.executionTime !== undefined && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-sm">
                          Temps d&apos;exécution
                        </p>
                        <p className="text-2xl font-bold text-orange-600">
                          {vulnerableResult.executionTime}ms
                        </p>
                      </div>
                    </div>
                  )}
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
                Cette version utilise des requêtes préparées (prepared
                statements) qui empêchent toute injection SQL
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
                  <div>✓ Messages d&apos;erreur génériques</div>
                  <div>✓ Paramètres typés et échappés</div>
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
