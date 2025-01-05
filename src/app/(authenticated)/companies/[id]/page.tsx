import List from "@/components/List";
import ListCard from "@/components/ListCard";
import { CompanyService } from "@/services/CompanyService";
import { generateTimeInterval } from "@/utils/utils";
import Image from "next/image";

interface CompanyParams {
  id: string;
}

export default async function Company({ params }: { params: CompanyParams }) {
  const { id: companyID } = params;

  const company = await CompanyService.getCompany(companyID);

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="h-full gap-y-4 text-black">
      <div className="flex flex-col items-center gap-y-2 p-4">
        <span className="text-2xl font-bold">{company.name}</span>
        <Image
          className="w-40 h-40 object-contain"
          width={150}
          height={150}
          src={company.img}
          alt={`${company.name} logo`}
        />
        {true && (
          <span className="bg-blue-dark text-white rounded-md px-3 py-1 text-lg font-bold uppercase">
            Here Today
          </span>
        )}
      </div>
      {/* Company Sessions */}
      {company.sessions?.length && (
        <List title="Sessions">
          {company.sessions.map((s) => (
            <ListCard
              key={s.id}
              title={s.name}
              headtext={generateTimeInterval(s.date, s.duration)}
              label={s.kind}
            />
          ))}
        </List>
      )}
      {/* Company Members */}
      {company.members?.length && (
        <List title="Members">
          {company.members.map((m) => (
            <ListCard key={m.id} title={m.name} img={m.img} subtitle={m.role} />
          ))}
        </List>
      )}
    </div>
  );
}
