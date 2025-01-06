"use client";

import GridList from "@/components/GridList";
import { CompanyTile } from "@/components/company";
import { useState } from "react";

interface CompaniesListProps {
  companies: Company[];
}

export default function CompaniesList({ companies }: CompaniesListProps) {
  const [filteredCompanies, setFilteredCompanies] =
    useState<Company[]>(companies);
  let debounce: NodeJS.Timeout;

  function handleSearch(text: string) {
    debounce && clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (text === "") {
        setFilteredCompanies(companies);
      } else {
        setFilteredCompanies(
          companies.filter((company) =>
            company.name.toLowerCase().includes(text.toLowerCase()),
          ),
        );
      }
    }, 300);
  }

  return (
    <>
      {/* TODO: Fix search width */}
      <input
        type="text"
        placeholder="Search companies"
        className="w-[90%] p-2 border mt-4 mx-4 rounded-md shadow-md sticky top-4 border-box"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <GridList title="Companies">
        {filteredCompanies.length === 0 && <div>No companies found</div>}
        {filteredCompanies.map((c) => (
          <CompanyTile key={c.id} company={c} />
        ))}
      </GridList>
    </>
  );
}
