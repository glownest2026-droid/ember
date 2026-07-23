"use client";

import { Builder } from "@builder.io/react";
import {
  HeroBlock,
  ValuePropsBlock,
  FeatureGridBlock,
  CtaBlock,
  SplitCtaBlock,
  TestimonialListBlock,
  FAQListBlock,
  LogoWallBlock,
  StatsBarBlock,
} from "../blocks/BrandedBlocks";

if (typeof window !== "undefined") {
  Builder.registerComponent(HeroBlock, {
    name: "Hero",
    inputs: [
      { name: "eyebrow", type: "string" },
      { name: "heading", type: "string", required: true },
      { name: "subheading", type: "longText" },
      { name: "primaryLabel", type: "string" },
      { name: "primaryHref", type: "url" },
      { name: "secondaryLabel", type: "string" },
      { name: "secondaryHref", type: "url" },
    ],
  });

  Builder.registerComponent(ValuePropsBlock, {
    name: "Value Props",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "icon", type: "string" },
          { name: "heading", type: "string", required: true },
          { name: "body", type: "longText" },
        ],
      },
    ],
  });

  Builder.registerComponent(FeatureGridBlock, {
    name: "Feature Grid",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "label", type: "string", required: true },
          { name: "description", type: "longText" },
          { name: "badge", type: "string" },
        ],
      },
    ],
  });

  Builder.registerComponent(CtaBlock, {
    name: "CTA",
    inputs: [
      { name: "kicker", type: "string" },
      { name: "heading", type: "string", required: true },
      { name: "body", type: "longText" },
      { name: "primaryLabel", type: "string", required: true },
      { name: "primaryHref", type: "url", required: true },
      {
        name: "variant",
        type: "string",
        enum: ["primary", "secondary"],
        defaultValue: "primary",
      },
    ],
  });

  Builder.registerComponent(SplitCtaBlock, {
    name: "CTA Split",
    inputs: [
      {
        name: "left",
        type: "object",
        subFields: [
          { name: "kicker", type: "string" },
          { name: "heading", type: "string", required: true },
          { name: "body", type: "longText" },
          { name: "primaryLabel", type: "string", required: true },
          { name: "primaryHref", type: "url", required: true },
          {
            name: "variant",
            type: "string",
            enum: ["primary", "secondary"],
            defaultValue: "primary",
          },
        ],
      },
      {
        name: "right",
        type: "object",
        subFields: [
          { name: "kicker", type: "string" },
          { name: "heading", type: "string", required: true },
          { name: "body", type: "longText" },
          { name: "primaryLabel", type: "string", required: true },
          { name: "primaryHref", type: "url", required: true },
          {
            name: "variant",
            type: "string",
            enum: ["primary", "secondary"],
            defaultValue: "secondary",
          },
        ],
      },
    ],
  });

  Builder.registerComponent(TestimonialListBlock, {
    name: "Testimonials",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "quote", type: "longText", required: true },
          { name: "name", type: "string", required: true },
          { name: "role", type: "string" },
        ],
      },
    ],
  });

  Builder.registerComponent(FAQListBlock, {
    name: "FAQ List",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "question", type: "string", required: true },
          { name: "answer", type: "longText", required: true },
        ],
      },
    ],
  });

  Builder.registerComponent(LogoWallBlock, {
    name: "Logo Wall",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "name", type: "string", required: true },
          { name: "imageUrl", type: "string" },
        ],
      },
    ],
  });

  Builder.registerComponent(StatsBarBlock, {
    name: "Stats Bar",
    inputs: [
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "label", type: "string", required: true },
          { name: "value", type: "string", required: true },
          { name: "helper", type: "string" },
        ],
      },
    ],
  });
}
