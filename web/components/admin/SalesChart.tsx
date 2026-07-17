export interface SalesChartProps {
	data: Array<{ month: string; total: number }>;
}

/** A hand-rolled SVG bar chart -- no charting library dependency for one admin-only graph. */
export function SalesChart({ data }: SalesChartProps) {
	if (data.length === 0) return <p className="text-sm text-text-muted">No sales yet.</p>;

	const max = Math.max(...data.map((point) => point.total), 1);
	const width = 600;
	const height = 220;
	const paddingBottom = 30;
	const barWidth = width / data.length;

	return (
		<svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Monthly sales chart">
			{data.map((point, index) => {
				const barHeight = (point.total / max) * (height - paddingBottom - 20);
				const barW = barWidth * 0.6;
				const x = index * barWidth + (barWidth - barW) / 2;
				const y = height - paddingBottom - barHeight;
				return (
					<g key={point.month}>
						<rect x={x} y={y} width={barW} height={Math.max(barHeight, 1)} rx={4} fill="var(--color-primary)" opacity={0.85} />
						<text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="11" fill="var(--color-text-subtle)">
							{point.month.slice(5)}
						</text>
						<text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
							${Math.round(point.total)}
						</text>
					</g>
				);
			})}
		</svg>
	);
}
