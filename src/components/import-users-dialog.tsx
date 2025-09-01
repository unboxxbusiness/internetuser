"use client";

import { useState, useTransition } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { bulkCreateUsersAction } from "@/app/actions";

interface NewUser {
  name: string;
  email: string;
  password?: string;
}

interface BulkCreateResult {
  successCount: number;
  errorCount: number;
  errors: { email: string; reason: string }[];
}

export function ImportUsersDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, startTransition] = useTransition();
  const [result, setResult] = useState<BulkCreateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleImport = () => {
    if (!file) {
      setError("Please select a file to import.");
      return;
    }

    setIsParsing(true);
    setError(null);
    setResult(null);

    Papa.parse<NewUser>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        const users = results.data.filter(u => u.email && u.name); // Basic validation
        if (users.length === 0) {
            setError("The selected CSV file is empty or doesn't contain valid user data with 'name' and 'email' columns.");
            return;
        }
        startTransition(async () => {
          const importResult = await bulkCreateUsersAction(users);
          setResult(importResult);
        });
      },
      error: (err: any) => {
        setIsParsing(false);
        setError(`Failed to parse CSV file: ${err.message}`);
      },
    });
  };

  const resetState = () => {
      setFile(null);
      setResult(null);
      setError(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetState();
    }}>
      <DialogTrigger asChild>
        <Button>
          <FileUp className="mr-2 h-4 w-4" /> Import Users
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Users from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to create multiple user accounts at once. The file must contain 'name' and 'email' columns. A 'password' column is optional; if omitted, a secure random password will be generated.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <a
            href="/sample_users.csv"
            download
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Sample CSV
          </a>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
             <div className="space-y-2">
                <Alert variant={result.errorCount > 0 ? "destructive" : "default"} className={result.errorCount === 0 ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" : ""}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle className={result.errorCount === 0 ? "text-green-800 dark:text-green-300" : ""}>Import Complete</AlertTitle>
                    <AlertDescription className={result.errorCount === 0 ? "text-green-700 dark:text-green-400" : ""}>
                        Successfully created {result.successCount} users. Failed to create {result.errorCount} users.
                    </AlertDescription>
                </Alert>
                {result.errors.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-md border p-2 text-sm">
                        <p className="font-semibold">Error Details:</p>
                        <ul className="list-disc pl-5">
                            {result.errors.map((e, i) => (
                                <li key={i}><strong>{e.email}:</strong> {e.reason}</li>
                            ))}
                        </ul>
                    </div>
                )}
             </div>
          )}

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleImport} disabled={!file || isParsing || isImporting}>
            {(isParsing || isImporting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isParsing ? "Parsing..." : isImporting ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
