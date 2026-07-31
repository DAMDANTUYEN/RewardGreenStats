import impactTreeModel from "@/data/impact-tree-model.json";
import { formatVnd } from "@/lib/impact";

import { ImpactIcon } from "./ImpactIcon";
import styles from "./impactTreeModel.module.css";

const { geometry, layout, leafGenerator, materials, timeline } = impactTreeModel;
const coordinateFactor = 10 ** leafGenerator.coordinateDecimals;

function roundCoordinate(value) {
  return Math.round(value * coordinateFactor) / coordinateFactor;
}

function createLeafCluster({
  centerX,
  centerY,
  radiusX,
  radiusY,
  count,
  seed,
}) {
  const radiusXSpan = leafGenerator.radiusXMax - leafGenerator.radiusXMin + 1;
  const radiusYSpan = leafGenerator.radiusYMax - leafGenerator.radiusYMin + 1;
  const rotationSpan =
    leafGenerator.rotationMaxDeg - leafGenerator.rotationMinDeg + 1;

  return Array.from({ length: count }, (_, index) => {
    const angle = index * leafGenerator.goldenAngleRadians + seed * 0.73;
    const distance = Math.sqrt((index + 0.38) / count);
    const wobble =
      1 +
      Math.sin((index + 1) * (seed + 2) * 0.41) *
        leafGenerator.wobbleAmplitude;
    const cx =
      centerX +
      Math.cos(angle) * radiusX * distance * wobble +
      Math.sin((index + seed) * 1.37) * leafGenerator.jitterX;
    const cy =
      centerY +
      Math.sin(angle) * radiusY * distance +
      Math.cos((index + seed) * 1.11) * leafGenerator.jitterY;
    const leafRadiusX =
      leafGenerator.radiusXMin + ((index * 7 + seed * 3) % radiusXSpan);
    const leafRadiusY =
      leafGenerator.radiusYMin + ((index * 5 + seed) % radiusYSpan);
    const rotation =
      leafGenerator.rotationMinDeg +
      ((index * 47 + seed * 29) % rotationSpan);
    const paletteId =
      materials.leafPalettes[(index * 3 + seed) % materials.leafPalettes.length]
        .id;

    return [
      roundCoordinate(cx),
      roundCoordinate(cy),
      leafRadiusX,
      leafRadiusY,
      rotation,
      paletteId,
    ];
  });
}

const branchTimelines = new Map(
  timeline.branches.map((branchTimeline) => [branchTimeline.id, branchTimeline]),
);

const branches = geometry.branches.map((branch) => {
  const branchTimeline = branchTimelines.get(branch.id);
  if (!branchTimeline) {
    throw new Error(`Missing animation timeline for tree branch: ${branch.id}`);
  }

  return {
    ...branch,
    timeline: branchTimeline,
    leaves: branch.clusters.flatMap(createLeafCluster),
  };
});

const crownLeaves = geometry.crown.clusters.flatMap(createLeafCluster);

function milliseconds(value) {
  return `${value}ms`;
}

function layoutVariables() {
  const desktopOutward = layout.desktop.labelsFaceOutward;
  const mobileOutward = layout.mobile.labelsFaceOutward;

  return {
    "--tree-top-desktop": `${layout.desktop.treeTopPx}px`,
    "--tree-bottom-desktop": `${layout.desktop.treeBottomPx}px`,
    "--tree-width-desktop": `${layout.desktop.treeWidthSvh}svh`,
    "--tree-min-width-desktop": `${layout.desktop.treeMinWidthPx}px`,
    "--tree-max-width-desktop": `${layout.desktop.treeMaxWidthPx}px`,
    "--node-width-desktop": `${layout.desktop.nodeWidthPx}px`,
    "--node-min-height-desktop": `${layout.desktop.nodeMinHeightPx}px`,
    "--node-dot-desktop": `${layout.desktop.nodeDotPx}px`,
    "--node-gap-desktop": `${layout.desktop.nodeGapPx}px`,
    "--node-title-desktop": `${layout.desktop.nodeTitlePx}px`,
    "--node-amount-desktop": `${layout.desktop.nodeAmountPx}px`,
    "--node-body-desktop": `${layout.desktop.nodeBodyPx}px`,
    "--left-flow-desktop": desktopOutward ? "row-reverse" : "row",
    "--right-flow-desktop": desktopOutward ? "row" : "row-reverse",
    "--left-align-desktop": desktopOutward ? "right" : "left",
    "--right-align-desktop": desktopOutward ? "left" : "right",
    "--left-shift-desktop": desktopOutward
      ? `calc(-100% + ${layout.desktop.nodeDotPx / 2}px)`
      : `${-layout.desktop.nodeDotPx / 2}px`,
    "--right-shift-desktop": desktopOutward
      ? `${-layout.desktop.nodeDotPx / 2}px`
      : `calc(-100% + ${layout.desktop.nodeDotPx / 2}px)`,
    "--tree-top-mobile": `${layout.mobile.treeTopPx}px`,
    "--tree-bottom-mobile": `${layout.mobile.treeBottomPx}px`,
    "--tree-width-vw-mobile": `${layout.mobile.treeWidthVw}vw`,
    "--tree-width-svh-mobile": `${layout.mobile.treeWidthSvh}svh`,
    "--tree-min-width-mobile": `${layout.mobile.treeMinWidthPx}px`,
    "--node-width-mobile": `${layout.mobile.nodeWidthPx}px`,
    "--node-min-height-mobile": `${layout.mobile.nodeMinHeightPx}px`,
    "--node-dot-mobile": `${layout.mobile.nodeDotPx}px`,
    "--node-gap-mobile": `${layout.mobile.nodeGapPx}px`,
    "--node-title-mobile": `${layout.mobile.nodeTitlePx}px`,
    "--node-amount-mobile": `${layout.mobile.nodeAmountPx}px`,
    "--node-body-display-mobile": layout.mobile.showNodeBody ? "block" : "none",
    "--left-flow-mobile": mobileOutward ? "row-reverse" : "row",
    "--right-flow-mobile": mobileOutward ? "row" : "row-reverse",
    "--left-align-mobile": mobileOutward ? "right" : "left",
    "--right-align-mobile": mobileOutward ? "left" : "right",
    "--left-shift-mobile": mobileOutward
      ? `calc(-100% + ${layout.mobile.nodeDotPx / 2}px)`
      : `${-layout.mobile.nodeDotPx / 2}px`,
    "--right-shift-mobile": mobileOutward
      ? `${-layout.mobile.nodeDotPx / 2}px`
      : `calc(-100% + ${layout.mobile.nodeDotPx / 2}px)`,
    "--tree-top-compact": `${layout.compact.treeTopPx}px`,
    "--tree-bottom-compact": `${layout.compact.treeBottomPx}px`,
    "--tree-width-vw-compact": `${layout.compact.treeWidthVw}vw`,
    "--tree-width-svh-compact": `${layout.compact.treeWidthSvh}svh`,
    "--tree-min-width-compact": `${layout.compact.treeMinWidthPx}px`,
    "--node-width-compact": `${layout.compact.nodeWidthPx}px`,
    "--node-min-height-compact": `${layout.compact.nodeMinHeightPx}px`,
    "--node-dot-compact": `${layout.compact.nodeDotPx}px`,
    "--node-gap-compact": `${layout.compact.nodeGapPx}px`,
    "--node-title-compact": `${layout.compact.nodeTitlePx}px`,
    "--node-amount-compact": `${layout.compact.nodeAmountPx}px`,
    "--node-body-display-compact": layout.compact.showNodeBody ? "block" : "none",
  };
}

const treeStyle = {
  ...layoutVariables(),
  "--ground-start": milliseconds(timeline.ground.startMs),
  "--ground-duration": milliseconds(timeline.ground.durationMs),
  "--ground-easing": timeline.ground.easing,
  "--trunk-start": milliseconds(timeline.trunk.startMs),
  "--trunk-duration": milliseconds(timeline.trunk.durationMs),
  "--trunk-easing": timeline.trunk.easing,
  "--root-start": milliseconds(timeline.rootFlare.startMs),
  "--root-duration": milliseconds(timeline.rootFlare.durationMs),
  "--root-easing": timeline.rootFlare.easing,
  "--crown-twig-start": milliseconds(timeline.crownTwigs.startMs),
  "--crown-twig-duration": milliseconds(timeline.crownTwigs.durationMs),
  "--crown-twig-easing": timeline.crownTwigs.easing,
  "--crown-leaf-start": milliseconds(timeline.crownLeaves.startMs),
  "--crown-leaf-duration": milliseconds(timeline.crownLeaves.durationMs),
  "--crown-leaf-stagger": milliseconds(timeline.crownLeaves.staggerMs),
  "--crown-leaf-easing": timeline.crownLeaves.easing,
  "--leaf-final-scale": leafGenerator.finalScale,
  "--leaf-final-opacity": leafGenerator.finalOpacity,
  "--twig-color": materials.twigColor,
  "--leaf-vein-color": materials.leafVeinColor,
  "--leaf-vein-opacity": materials.leafVeinOpacity,
};

function branchVariables(branch) {
  return {
    "--branch-start": milliseconds(branch.timeline.bodyStartMs),
    "--branch-duration": milliseconds(branch.timeline.bodyDurationMs),
    "--branch-twig-start": milliseconds(branch.timeline.twigStartMs),
    "--branch-twig-duration": milliseconds(branch.timeline.twigDurationMs),
    "--branch-leaf-start": milliseconds(branch.timeline.leafStartMs),
    "--branch-leaf-duration": milliseconds(branch.timeline.leafDurationMs),
    "--branch-leaf-stagger": milliseconds(branch.timeline.leafStaggerMs),
    "--branch-node-start": milliseconds(branch.timeline.nodeStartMs),
    "--branch-node-duration": milliseconds(branch.timeline.nodeDurationMs),
    "--branch-easing": branch.timeline.easing,
  };
}

function Leaf({ leaf, order }) {
  const [cx, cy, rx, ry, rotate, paletteId] = leaf;

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <g
        className={styles.leafShape}
        style={
          {
            "--leaf-order": order,
            "--leaf-fill": `url(#leaf-${paletteId})`,
          }
        }
      >
        <path d={`M ${-rx} 0 Q 0 ${-ry} ${rx} 0 Q 0 ${ry} ${-rx} 0 Z`} />
        <path
          className={styles.leafVein}
          d={`M ${-rx * 0.55} 0 L ${rx * 0.62} 0`}
        />
      </g>
    </g>
  );
}

export function ImpactTreeNetwork({
  items,
  scene,
  selectedItemId,
  onSelect,
}) {
  const treeVisible =
    scene === "root-growth" ||
    scene === "revealing-items" ||
    scene === "complete";
  const treeComplete = scene === "complete";

  return (
    <div
      className={`${styles.treeNetwork} ${
        treeVisible ? styles.treeNetworkVisible : ""
      } ${treeComplete ? styles.treeNetworkComplete : ""}`}
      style={treeStyle}
      data-impact-tree
      data-model-version={impactTreeModel.version}
      data-render-order={impactTreeModel.renderOrder.join(",")}
    >
      <svg
        className={styles.treeSvg}
        viewBox={impactTreeModel.viewBox.join(" ")}
        preserveAspectRatio={impactTreeModel.preserveAspectRatio}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="trunk-bark" x1="0" y1="0" x2="1" y2="0">
            {materials.trunkGradient.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
          <linearGradient id="branch-bark" x1="0" y1="0" x2="0" y2="1">
            {materials.branchGradient.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
          {materials.leafPalettes.map((palette) => (
            <radialGradient key={palette.id} id={`leaf-${palette.id}`}>
              <stop offset="0" stopColor={palette.inner} />
              <stop offset="0.58" stopColor={palette.middle} />
              <stop offset="1" stopColor={palette.outer} />
            </radialGradient>
          ))}
          <filter id="tree-shadow" x="-40%" y="-35%" width="180%" height="190%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="9"
              floodColor={materials.shadowColor}
              floodOpacity={materials.shadowOpacity}
            />
          </filter>
          <filter id="leaf-shadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor={materials.shadowColor}
              floodOpacity={Math.min(materials.shadowOpacity, 0.7)}
            />
          </filter>
          <mask id="trunk-growth">
            <path
              className={`${styles.treeReveal} ${styles.trunkReveal} ${
                treeVisible ? styles.treeRevealActive : ""
              }`}
              pathLength="1"
              strokeWidth={geometry.trunk.maskStrokeWidth}
              d={geometry.trunk.growthPath}
            />
          </mask>
          {branches.map((branch) => (
            <mask key={branch.id} id={`branch-growth-${branch.id}`}>
              <path
                className={`${styles.treeReveal} ${styles.branchReveal} ${
                  treeVisible ? styles.treeRevealActive : ""
                }`}
                style={branchVariables(branch)}
                pathLength="1"
                strokeWidth={branch.maskStrokeWidth}
                d={branch.growthPath}
              />
            </mask>
          ))}
        </defs>

        <ellipse
          className={styles.treeGroundShadow}
          cx={geometry.ground.cx}
          cy={geometry.ground.cy}
          rx={geometry.ground.radiusX}
          ry={geometry.ground.radiusY}
        />

        <g className={styles.twigLayer}>
          {geometry.crown.twigPaths.map((twig) => (
            <path
              key={twig}
              className={styles.crownTwig}
              pathLength="1"
              strokeWidth={geometry.crown.twigStrokeWidth}
              d={twig}
            />
          ))}
          {branches.map((branch) => (
            <g key={branch.id} style={branchVariables(branch)}>
              {branch.twigPaths.map((twig) => (
                <path
                  key={twig}
                  className={styles.branchTwig}
                  pathLength="1"
                  strokeWidth={branch.twigStrokeWidth}
                  d={twig}
                />
              ))}
            </g>
          ))}
        </g>

        <g className={styles.branchBodies}>
          {branches.map((branch) => (
            <g
              key={branch.id}
              className={styles.branchLayer}
              style={branchVariables(branch)}
              mask={`url(#branch-growth-${branch.id})`}
            >
              <path className={styles.branchBody} d={branch.silhouettePath} />
            </g>
          ))}
        </g>

        <g mask="url(#trunk-growth)" filter="url(#tree-shadow)">
          <path
            className={styles.trunkBody}
            d={geometry.trunk.bodyPath}
            strokeWidth={geometry.trunk.bodyStrokeWidth}
          />
        </g>

        <path
          className={styles.rootFlare}
          pathLength="1"
          d={geometry.rootFlare.path}
          strokeWidth={geometry.rootFlare.strokeWidth}
        />

        <g className={styles.foliageLayer} filter="url(#leaf-shadow)">
          <g className={styles.crownLeaves}>
            {crownLeaves.map((leaf, leafIndex) => (
              <Leaf key={`crown-${leafIndex}`} leaf={leaf} order={leafIndex} />
            ))}
          </g>
          {branches.map((branch) => (
            <g
              key={branch.id}
              className={styles.branchLeaves}
              style={branchVariables(branch)}
            >
              {branch.leaves.map((leaf, leafIndex) => (
                <Leaf key={`${branch.id}-${leafIndex}`} leaf={leaf} order={leafIndex} />
              ))}
            </g>
          ))}
        </g>
      </svg>

      <div className={styles.treeNodes}>
        {items.slice(0, branches.length).map((item, index) => {
          const branch = branches[index];
          const selected = selectedItemId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              data-impact-node
              className={`${styles.treeNode} ${styles.treeNodeRevealed} ${
                branch.side === "left"
                  ? styles.treeNodeLeft
                  : styles.treeNodeRight
              } ${selected ? styles.treeNodeSelected : ""}`}
              style={
                {
                  ...branchVariables(branch),
                  "--tree-node-x": `${branch.nodeXPercent}%`,
                  "--tree-node-y": `${branch.nodeYPercent}%`,
                }
              }
              onClick={() => onSelect(item)}
              tabIndex={treeComplete ? 0 : -1}
              aria-pressed={selected}
              aria-label={`${item.label}, ${formatVnd(item.amount)}. ${item.impactText}`}
            >
              <span className={styles.treeNodeDot}>
                <ImpactIcon name={item.icon} />
              </span>
              <span className={styles.treeNodeCopy}>
                <strong>{item.shortLabel ?? item.label}</strong>
                <span>{formatVnd(item.amount)}</span>
                <small>{item.impactText}</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
