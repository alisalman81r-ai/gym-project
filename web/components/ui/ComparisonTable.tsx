import { Check } from "lucide-react";

export interface ComparisonRow {
	feature: string;
	signature: boolean | string;
	elite: boolean | string;
	privateClub: boolean | string;
}

export interface ComparisonTableProps {
	rows: ComparisonRow[];
}

function Cell({ value }: { value: boolean | string }) {
	if (value === true) return <Check className="mx-auto text-primary" size={18} />;
	if (value === false) return <span className="text-text-subtle">&mdash;</span>;
	return <span>{value}</span>;
}

/** Full feature-by-tier comparison — used on the Membership page. */
export function ComparisonTable({ rows }: ComparisonTableProps) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-border">
			<table className="w-full min-w-[560px] border-collapse text-sm">
				<thead>
					<tr className="bg-secondary text-left">
						<th className="p-4 font-semibold text-text-muted">Feature</th>
						<th className="p-4 text-center font-semibold text-text">Signature</th>
						<th className="p-4 text-center font-semibold text-primary">Elite</th>
						<th className="p-4 text-center font-semibold text-text">Private Club</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.feature} className="border-t border-border">
							<td className="p-4 text-text-muted">{row.feature}</td>
							<td className="p-4 text-center">
								<Cell value={row.signature} />
							</td>
							<td className="p-4 text-center">
								<Cell value={row.elite} />
							</td>
							<td className="p-4 text-center">
								<Cell value={row.privateClub} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
