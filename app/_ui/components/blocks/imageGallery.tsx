"use client"
import React from "react";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/app/_lib/util/links";


// ---------- Types ----------
export type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";


export interface IGalleryImage {
  src: string;
  alt: string;
  href?: string; // optional link when clicking the image
  caption?: string;
}


export type ResponsiveNumber =
  | number
  | {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };


export interface IImageGalleryBlock {
  blockType: "imageGallery";
  images: IGalleryImage[];
  /** Number of columns per breakpoint */
  columns?: ResponsiveNumber; // default: { xs: 1, sm: 2, md: 3, lg: 4 }
  /**
  * Number of rows per breakpoint. When provided, the gallery will only render up to rows * columns images
  * for the current breakpoint. When omitted, all images are shown and rows are unconstrained.
  */
  rows?: ResponsiveNumber;
  /** How images should fit inside their tiles */
  objectFit?: ObjectFit; // default: 'cover'
  /** Gap (spacing) between tiles */
  gap?: number; // default: 2 (theme spacing units)
  /** CSS aspect-ratio for each tile (e.g., '1 / 1', '16 / 9') */
  aspectRatio?: string; // default: '1 / 1'
  /** Border radius for the image tiles */
  borderRadius?: number | string; // default: 2 (theme.shape.borderRadius scale)
}


// ---------- Helpers ----------
const toBreakpointMap = (
  val: ResponsiveNumber | undefined,
  fallback: Required<Record<"xs" | "sm" | "md" | "lg", number>> = { xs: 1, sm: 2, md: 3, lg: 4 }
) => {
  const base = typeof val === "number" || val == null ? {} : val;
  const xs = typeof val === "number" ? val : base.xs ?? fallback.xs;
  const sm = typeof val === "number" ? val : base.sm ?? fallback.sm;
  const md = typeof val === "number" ? val : base.md ?? fallback.md;
  const lg = typeof val === "number" ? val : base.lg ?? fallback.lg;
  const xl = typeof val === "number" ? val : base.xl ?? fallback.lg; // map xl -> lg fallback
  return { xs, sm, md, lg, xl };
};


// Convert a columns map into Grid2 `size` object where the grid has 12 columns per row.
// We assign each item a fraction of 12 based on desired column count.
const toGridItemSizes = (columns: ReturnType<typeof toBreakpointMap>) => {
  const frac = (c: number) => {
    const v = Math.max(1, Math.min(12, Math.round(12 / c)));
    return v as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  return {
    xs: frac(columns.xs),
    sm: frac(columns.sm),
    md: frac(columns.md),
    lg: frac(columns.lg),
    xl: frac(columns.xl),
  } as const;
};


const currentLimit = (
  rowsMap: ReturnType<typeof toBreakpointMap> | null,
  colsMap: ReturnType<typeof toBreakpointMap>
) => {
  // We cannot reliably know the active breakpoint without media queries,
  // so we render conservatively: if rows are provided, limit by the *largest* rows*cols across breakpoints
  // to avoid hiding too many images on large screens. Designers can omit `rows` to show all.
  if (!rowsMap) return Infinity;
  const candidates = [
    (rowsMap.xs ?? 0) * colsMap.xs,
    (rowsMap.sm ?? 0) * colsMap.sm,
    (rowsMap.md ?? 0) * colsMap.md,
    (rowsMap.lg ?? 0) * colsMap.lg,
    (rowsMap.xl ?? 0) * colsMap.xl,
  ].filter((n) => n > 0);
  if (candidates.length === 0) return Infinity;
  return Math.max(...candidates);
};


// ---------- Component ----------
export function ImageGalleryBlock({
  images,
  columns,
  rows,
  objectFit = "cover",
  gap = 2,
  aspectRatio = "1 / 1",
  borderRadius = 2,
}: IImageGalleryBlock) {
  const colMap = toBreakpointMap(columns, { xs: 1, sm: 2, md: 3, lg: 4 });
  const size = toGridItemSizes(colMap);
  const rowMap = rows ? toBreakpointMap(rows, { xs: 1, sm: 1, md: 1, lg: 1 }) : null;
  const limit = currentLimit(rowMap, colMap);
  const list = Number.isFinite(limit) ? images.slice(0, limit as number) : images;


  return (
    <Box width="100%">
      <Grid container spacing={gap} columns={12}>
        {list.map((img, idx) => {
          const Tile = (
            <Box sx={{ position: "relative", width: "100%", aspectRatio, overflow: "hidden", borderRadius }}>
              <Image
                src={withBasePath(img.src)}
                alt={img.alt}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                style={{ objectFit }}
                priority={idx < 2}
              />
              {img.caption && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    p: 1,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "common.white",
                    fontSize: 12,
                  }}
                >
                  {img.caption}
                </Box>
              )}
            </Box>
          );


          return (
            <Grid key={`img-${idx}`} size={size}>
              {img.href ? (
                <Link href={img.href} style={{ display: "block" }}>
                  {Tile}
                </Link>
              ) : (
                Tile
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}