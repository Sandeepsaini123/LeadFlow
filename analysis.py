"""
LeadFlow — Lead Data Analysis Script
Fetches lead data from MongoDB and generates a summary report.

Requirements:
    pip install pymongo pandas python-dotenv tabulate

Usage:
    python analysis.py
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
import pandas as pd
from tabulate import tabulate

load_dotenv("backend/.env")

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise EnvironmentError("MONGO_URI not found. Make sure backend/.env exists.")


def fetch_leads():
    client = MongoClient(MONGO_URI)
    db = client["leadDB"]
    leads = list(db["leads"].find({}, {"_id": 0}))
    client.close()
    return leads


def analyse(leads: list) -> None:
    if not leads:
        print("No leads found in the database.")
        return

    df = pd.DataFrame(leads)
    df["createdAt"] = pd.to_datetime(df["createdAt"])

    print("\n" + "=" * 55)
    print("         LEADFLOW — DATA ANALYSIS REPORT")
    print("=" * 55)

    # ── Overview ──────────────────────────────────────────
    total = len(df)
    converted = len(df[df["status"] == "Converted"])
    conversion_rate = (converted / total * 100) if total else 0

    print(f"\n📊 OVERVIEW")
    print(f"   Total Leads      : {total}")
    print(f"   Converted        : {converted}")
    print(f"   Conversion Rate  : {conversion_rate:.1f}%")
    print(f"   Avg Budget       : ₹{df['budget'].mean():,.0f}")
    print(f"   Max Budget       : ₹{df['budget'].max():,.0f}")
    print(f"   Min Budget       : ₹{df['budget'].min():,.0f}")

    # ── Status Breakdown ──────────────────────────────────
    print(f"\n📌 STATUS BREAKDOWN")
    status_counts = df["status"].value_counts().reset_index()
    status_counts.columns = ["Status", "Count"]
    status_counts["Percentage"] = (status_counts["Count"] / total * 100).map("{:.1f}%".format)
    print(tabulate(status_counts, headers="keys", tablefmt="rounded_outline", showindex=False))

    # ── City-wise Analysis ────────────────────────────────
    print(f"\n🏙️  CITY-WISE ANALYSIS")
    city_group = df.groupby("city").agg(
        Leads=("city", "count"),
        Converted=("status", lambda x: (x == "Converted").sum()),
        Avg_Budget=("budget", "mean"),
    ).reset_index()
    city_group["Conversion %"] = (city_group["Converted"] / city_group["Leads"] * 100).map("{:.1f}%".format)
    city_group["Avg_Budget"] = city_group["Avg_Budget"].map("₹{:,.0f}".format)
    city_group = city_group.rename(columns={"city": "City", "Avg_Budget": "Avg Budget"})
    city_group = city_group.sort_values("Leads", ascending=False)
    print(tabulate(city_group, headers="keys", tablefmt="rounded_outline", showindex=False))

    # ── Service-wise Analysis ─────────────────────────────
    print(f"\n🛠️  SERVICE-WISE ANALYSIS")
    service_group = df.groupby("service").agg(
        Leads=("service", "count"),
        Converted=("status", lambda x: (x == "Converted").sum()),
        Avg_Budget=("budget", "mean"),
    ).reset_index()
    service_group["Conversion %"] = (service_group["Converted"] / service_group["Leads"] * 100).map("{:.1f}%".format)
    service_group["Avg_Budget"] = service_group["Avg_Budget"].map("₹{:,.0f}".format)
    service_group = service_group.rename(columns={"service": "Service", "Avg_Budget": "Avg Budget"})
    service_group = service_group.sort_values("Leads", ascending=False)
    print(tabulate(service_group, headers="keys", tablefmt="rounded_outline", showindex=False))

    # ── Key Insights ──────────────────────────────────────
    print(f"\n💡 KEY INSIGHTS")

    top_city = city_group.iloc[0]["City"]
    top_service = service_group.iloc[0]["Service"]

    best_conversion_city = df[df["status"] == "Converted"]["city"].value_counts()
    if not best_conversion_city.empty:
        print(f"   • {best_conversion_city.index[0]} has the highest number of converted leads.")

    print(f"   • '{top_service}' is the most requested service.")
    print(f"   • '{top_city}' generates the most leads.")
    print(f"   • Overall conversion rate is {conversion_rate:.1f}%.")

    high_budget = df[df["budget"] >= 100000]
    if not high_budget.empty:
        print(f"   • {len(high_budget)} leads have a budget of ₹1,00,000 or more.")

    print("\n" + "=" * 55 + "\n")


if __name__ == "__main__":
    print("Fetching leads from MongoDB...")
    leads = fetch_leads()
    analyse(leads)
