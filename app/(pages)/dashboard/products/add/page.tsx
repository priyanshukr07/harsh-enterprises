import React from "react";
import { Sprout, Sun, Droplets } from "lucide-react";
import CreateProduct from "@/app/_dashboardComponents/CreateProduct";

const AddProduct = () => {
  return (
    <div className="min-h-screen bg-background text-foreground bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground transition-colors duration-300 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 flex items-center justify-center shadow-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-background text-foreground">
                Add New Product
              </h1>
              <p className="text-sm bg-background text-foreground mt-0.5">
                Create detailed product listings for threads, cocopeat, and
                seedling trays
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background text-foreground rounded-xl p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 bg-background:bg-green-950/50 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm bg-background:bg-green-950/50 text-foreground">
                  Active Products
                </p>
                <p className="text-xl font-bold bg-background text-foreground">
                  248
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background text-foreground rounded-xl p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  1,429
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background text-foreground rounded-xl p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Revenue
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  ₹2.4L
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-background text-foreground p-8 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;