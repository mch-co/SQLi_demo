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
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Bug, Database, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  username: string;
  comment: string;
  created_at: string;
}

export default function SQLiStockee() {
  const [vulnerableUsername, setVulnerableUsername] = useState("");
  const [vulnerableComment, setVulnerableComment] = useState("");
  const [secureUsername, setSecureUsername] = useState("");
  const [secureComment, setSecureComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [vulnerableResult, setVulnerableResult] = useState<{
    error?: string;
    success?: boolean;
    message?: string;
    query?: string;
  } | null>(null);
  const [secureResult, setSecureResult] = useState<{
    error?: string;
    success?: boolean;
    message?: string;
  } | null>(null);
  const [searchResult, setSearchResult] = useState<{
    error?: string;
    success?: boolean;
    data?: unknown;
    query?: string;
    sqlMessage?: string;
  } | null>(null);
  const [vulnerableLoading, setVulnerableLoading] = useState(false);
  const [secureLoading, setSecureLoading] = useState(false);

  const loadComments = async () => {
    try {
      const response = await fetch("/api/sqli-stored");
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch {
      console.error("Erreur lors du chargement des commentaires");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/sqli-stored");
        const data = await response.json();
        if (data.success) {
          setComments(data.data);
        }
      } catch {
        console.error("Erreur lors du chargement des commentaires");
      }
    };
    void fetchComments();
  }, []);

  const addVulnerableComment = async () => {
    setVulnerableLoading(true);
    try {
      const response = await fetch("/api/sqli-stored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: vulnerableUsername,
          comment: vulnerableComment,
          vulnerable: true,
        }),
      });
      const data = await response.json();
      setVulnerableResult(data);
      if (data.success) {
        loadComments();
        setVulnerableUsername("");
        setVulnerableComment("");
      }
    } catch {
      setVulnerableResult({ error: "Erreur de connexion" });
    }
    setVulnerableLoading(false);
  };

  const addSecureComment = async () => {
    setSecureLoading(true);
    try {
      const response = await fetch("/api/sqli-stored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: secureUsername,
          comment: secureComment,
          vulnerable: false,
        }),
      });
      const data = await response.json();
      setSecureResult(data);
      if (data.success) {
        loadComments();
        setSecureUsername("");
        setSecureComment("");
      }
    } catch {
      setSecureResult({ error: "Erreur de connexion" });
    }
    setSecureLoading(false);
  };

  const searchByUsername = async (username: string, vulnerable: boolean) => {
    try {
      const response = await fetch("/api/sqli-search-stored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, vulnerable }),
      });
      const data = await response.json();
      setSearchResult(data);
    } catch {
      setSearchResult({ error: "Erreur de connexion" });
    }
  };

  const clearComments = async () => {
    try {
      await fetch("/api/sqli-stored", { method: "DELETE" });
      loadComments();
      setSearchResult(null);
    } catch {
      console.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          SQLi Stockée (Stored/Second-Order SQLi)
        </h1>
        <p className="text-muted-foreground">
          Démonstration d&apos;injection SQL stockée où le payload malveillant
          est stocké puis exécuté lors d&apos;une opération ultérieure
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
                Version Vulnérable - Étape 1 : Insertion
              </CardTitle>
              <CardDescription>
                Insérez un commentaire avec un payload SQL malveillant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nom d&apos;utilisateur
                </label>
                <Input
                  value={vulnerableUsername}
                  onChange={(e) => setVulnerableUsername(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire</label>
                <Textarea
                  value={vulnerableComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setVulnerableComment(e.target.value)
                  }
                  placeholder="Votre commentaire"
                  rows={3}
                />
              </div>
              <Button
                onClick={addVulnerableComment}
                disabled={vulnerableLoading}
              >
                {vulnerableLoading ? "Ajout..." : "Ajouter le commentaire"}
              </Button>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  Exemples de payloads pour SQLi Stockée (MariaDB)
                </AlertTitle>
                <AlertDescription className="space-y-1 text-xs mt-2">
                  <div>
                    <strong>Nom d&apos;utilisateur malveillant :</strong>
                    <br />
                    <code>admin&apos; OR &apos;1&apos;=&apos;1</code> - Bypass
                    d&apos;authentification
                  </div>
                  <div>
                    <code>admin&apos;--</code> - Commentaire SQL
                  </div>
                  <div>
                    <code>admin&apos; UNION SELECT 1,2,3--</code> - UNION
                    injection
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

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-5 w-5" />
                Version Vulnérable - Étape 2 : Exploitation
              </CardTitle>
              <CardDescription>
                Cliquez sur un commentaire pour déclencher la recherche
                (Second-Order)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Commentaires stockés :</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearComments}
                  >
                    <Trash2 className="ml-4 h-4 w-4 mr-2" />
                    Vider
                  </Button>
                </div>
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun commentaire
                  </p>
                ) : (
                  <div className="space-y-2">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => searchByUsername(comment.username, true)}
                      >
                        <p className="font-semibold text-sm">
                          {comment.username}
                        </p>
                        <p className="text-sm">{comment.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {searchResult && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Résultat de la recherche :</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(searchResult, null, 2)}
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
                Cette version utilise des requêtes préparées pour
                l&apos;insertion ET la recherche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nom d&apos;utilisateur
                </label>
                <Input
                  placeholder="Votre nom"
                  value={secureUsername}
                  onChange={(e) => setSecureUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire</label>
                <Textarea
                  placeholder="Votre commentaire"
                  value={secureComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setSecureComment(e.target.value)
                  }
                  rows={3}
                />
              </div>
              <Button onClick={addSecureComment} disabled={secureLoading}>
                {secureLoading ? "Ajout..." : "Ajouter le commentaire"}
              </Button>

              <Alert className="border-green-600">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">
                  Protection active
                </AlertTitle>
                <AlertDescription className="space-y-1 text-xs mt-2">
                  <div>✓ Validation des entrées</div>
                  <div>✓ Requêtes préparées à l&apos;insertion</div>
                  <div>✓ Requêtes préparées à l&apos;utilisation</div>
                  <div>✓ Échappement automatique des caractères spéciaux</div>
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
