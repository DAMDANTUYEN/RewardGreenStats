export const MAX_ANIMATED_ITEMS = 5;

export function formatVnd(amount) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}

export function sortImpactItems(items) {
  return [...items].sort((a, b) => a.order - b.order);
}

export function getAnimatedItems(items) {
  return sortImpactItems(items).slice(0, MAX_ANIMATED_ITEMS);
}

export function getContributionTotal(items) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function isContributionValid(data) {
  return getContributionTotal(data.impactItems) === data.totalContribution;
}

export function getImpactSummary(data) {
  const allocation = sortImpactItems(data.impactItems)
    .map((item) => `${formatVnd(item.amount)} cho ${item.label.toLowerCase()}`)
    .join(", ");

  return `Tổng đóng góp ${formatVnd(data.totalContribution)}. Phân bổ gồm ${allocation}.`;
}
