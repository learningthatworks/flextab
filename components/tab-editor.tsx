"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorPicker } from "./color-picker"
import { Slider } from "./slider"
import { Maximize2, ChevronDown, ChevronUp, Clipboard } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Resizable } from "re-resizable"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

const generatePlaceholderText = (paragraphs: number): string => {
  const loremParagraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  ]

  let result = ""
  for (let i = 0; i < paragraphs; i++) {
    result += loremParagraphs[i % loremParagraphs.length] + "\n"
  }
  return result
}

interface Tab {
  title: string
  content: string
  youtubeLink: string
}

export default function TabEditor() {
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "Tab 1", content: generatePlaceholderText(2), youtubeLink: "" },
    { title: "Tab 2", content: generatePlaceholderText(2), youtubeLink: "" },
    { title: "Tab 3", content: generatePlaceholderText(2), youtubeLink: "" },
  ])
  const [activeTab, setActiveTab] = useState("0")
  const [tabBgColor, setTabBgColor] = useState("#264180")
  const [activeTabBgColor, setActiveTabBgColor] = useState("#1b8ffa")
  const [tabTextColor, setTabTextColor] = useState("#ffffff")
  const [tabTitleGroupBgColor, setTabTitleGroupBgColor] = useState("#f0f0f0")
  const [cornerRadius, setCornerRadius] = useState(5)
  const [shadowIntensity, setShadowIntensity] = useState(0)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isCodeView, setIsCodeView] = useState(false)
  const [isFullPageLayout, setIsFullPageLayout] = useState(false)
  const [editableHtml, setEditableHtml] = useState("")
  const [tabContentBgColor, setTabContentBgColor] = useState("#ffffff")
  const [tabContentTextColor, setTabContentTextColor] = useState("#000000")
  const [tabHeight, setTabHeight] = useState(50)
  const [fontSize, setFontSize] = useState(16)
  const [tabContentPadding, setTabContentPadding] = useState(20)
  const [tabContentHeight, setTabContentHeight] = useState(200)
  const [isSliderMode, setIsSliderMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAutoHeight, setIsAutoHeight] = useState(true)
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [tabPosition, setTabPosition] = useState<"top" | "left" | "right" | "bottom">("top")
  const [titleBorderSize, setTitleBorderSize] = useState(1)
  const [titleBorderColor, setTitleBorderColor] = useState("#cccccc")
  const [titleDropShadowIntensity, setTitleDropShadowIntensity] = useState(0)
  const [tabCount, setTabCount] = useState(tabs.length)
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([])
  const [selectedTheme, setSelectedTheme] = useState<"custom" | "light" | "dark">("custom")
  const [isAnimated, setIsAnimated] = useState(true)
  const [isFlipCardMode, setIsFlipCardMode] = useState(false)
  const [isAccordionMode, setIsAccordionMode] = useState(false)

  const themes = {
    light: {
      tabBg: "#f0f0f0",
      activeTabBg: "#ffffff",
      tabText: "#333333",
      contentBg: "#ffffff",
      contentText: "#333333",
    },
    dark: {
      tabBg: "#333333",
      activeTabBg: "#1a1a1a",
      tabText: "#ffffff",
      contentBg: "#1a1a1a",
      contentText: "#ffffff",
    },
  }

  const applyTheme = (theme: "light" | "dark") => {
    const colors = themes[theme]
    setTabBgColor(colors.tabBg)
    setActiveTabBgColor(colors.activeTabBg)
    setTabTextColor(colors.tabText)
    setTabContentBgColor(colors.contentBg)
    setTabContentTextColor(colors.contentText)
    setSelectedTheme(theme)
  }

  const handleTabChange = (title: string, index: number) => {
    const newTabs = [...tabs]
    newTabs[index].title = title
    setTabs(newTabs)
    updatePreviewHtml()
  }

  const handleContentChange = (content: string, index: number) => {
    const newTabs = [...tabs]
    newTabs[index].content = content
    setTabs(newTabs)
    updatePreviewHtml()
  }

  const handleYoutubeLinkChange = (link: string, index: number) => {
    const newTabs = [...tabs]
    newTabs[index].youtubeLink = link
    setTabs(newTabs)
    if (link) {
      setTabContentHeight(Math.max(tabContentHeight, 400)) // Ensure minimum height for video
    }
    updatePreviewHtml()
  }

  const addTab = () => {
    setTabs([...tabs, { title: `Tab ${tabs.length + 1}`, content: generatePlaceholderText(2), youtubeLink: "" }])
  }

  const removeTab = () => {
    if (tabs.length > 1) {
      const newTabs = [...tabs.slice(0, -1)]
      setTabs(newTabs)
      if (Number.parseInt(activeTab) >= newTabs.length) {
        setActiveTab((newTabs.length - 1).toString())
      }
      updatePreviewHtml()
    }
  }

  const handleTabCountChange = (newCount: number) => {
    if (newCount > tabs.length) {
      const newTabs = [...tabs]
      for (let i = tabs.length; i < newCount; i++) {
        newTabs.push({ title: `Tab ${i + 1}`, content: generatePlaceholderText(2), youtubeLink: "" })
      }
      setTabs(newTabs)
    } else if (newCount < tabs.length) {
      setTabs(tabs.slice(0, newCount))
      if (Number.parseInt(activeTab) >= newCount) {
        setActiveTab((newCount - 1).toString())
      }
    }
    setTabCount(newCount)
  }

  const getYoutubeEmbedUrl = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = link.match(regExp)
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : ""
  }

  const generateHTML = () => {
    const html = isSliderMode
      ? `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Slider</title>
    <style>
        body {
            font-family: ${fontFamily};
            margin: 0;
            padding: ${isFullPageLayout ? "0" : "20px"};
            background-color: #f0f0f0;
        }
        .slider {
            position: relative;
            width: 100%;
            height: ${isAutoHeight ? "auto" : `${tabContentHeight}px`};
            min-height: ${isAutoHeight ? "auto" : `${tabContentHeight}px`};
            margin: 0 auto;
            box-shadow: 0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 0, 0, ${shadowIntensity * 0.1});
            background-color: ${tabContentBgColor};
            overflow: hidden;
            ${isFullPageLayout ? "" : `border-radius: ${cornerRadius}px;`}
        }
        .slider-controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        .slider input[type="radio"] {
            display: none;
        }
        .slider-controls label {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: ${tabBgColor};
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .slider-controls label:hover {
            background-color: ${activeTabBgColor};
        }
        ${tabs
          .map(
            (_, index) => `
        #btn-${index + 1}:checked ~ .slider-controls label[for="btn-${index + 1}"] {
            background-color: ${activeTabBgColor};
        }
        `,
          )
          .join("\n")}
        .slides {
            display: flex;
            transition: transform 0.5s ease-in-out;
            height: 100%;
        }
        .slide {
            flex: 0 0 100%;
            padding: ${tabContentPadding}px;
            box-sizing: border-box;
            background-color: ${tabContentBgColor};
            color: ${tabContentTextColor};
            font-size: ${fontSize}px;
            overflow-y: auto;
        }
        ${tabs
          .map(
            (_, index) => `
        #btn-${index + 1}:checked ~ .slides {
            transform: translateX(-${index * 100}%);
        }
        `,
          )
          .join("\n")}
        .slide-title {
            font-size: ${fontSize * 1.5}px;
            margin-bottom: 15px;
        }
        .iframe-container {
          overflow: hidden;
          padding-top: 56.25%;
          position: relative;
        }

        .iframe-container iframe {
          border: 0;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
    </style>
</head>
<body>
    <div class="slider">
        ${tabs
          .map(
            (_, index) => `
        <input type="radio" name="slider" id="btn-${index + 1}" ${index === 0 ? "checked" : ""}>
        `,
          )
          .join("\n")}
        <div class="slider-controls">
            ${tabs
              .map(
                (_, index) => `
            <label for="btn-${index + 1}"></label>
            `,
              )
              .join("\n")}
        </div>
        <div class="slides">
            ${tabs
              .map(
                (tab, index) => `
            <div class="slide">
                <h2 class="slide-title">${tab.title}</h2>
                <div class="slide-content">${tab.content}</div>
                ${
                  tab.youtubeLink
                    ? `
                <div class="iframe-container">
                  <iframe 
                    loading="lazy"
                    src="${getYoutubeEmbedUrl(tab.youtubeLink)}" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                  ></iframe>
                </div>
                `
                    : ""
                }
            </div>
            `,
              )
              .join("\n")}
        </div>
    </div>
</body>
</html>
    `
      : isFlipCardMode
        ? `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flipcard Tabs</title>
    <style>
        body {
            font-family: ${fontFamily};
            margin: 0;
            padding: ${isFullPageLayout ? "0" : "20px"};
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .flipcard-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        .flipcard {
            width: 300px;
            height: 400px;
            perspective: 1000px;
            margin: 10px;
        }
        .flipcard-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            box-shadow: 0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 0, 0, ${shadowIntensity * 0.1});
            cursor: pointer;
        }
        .flipcard.flipped .flipcard-inner {
            transform: rotateY(180deg);
        }
        .flipcard-front, .flipcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            border-radius: ${cornerRadius}px;
            overflow: hidden;
        }
        .flipcard-front {
            background-color: ${tabBgColor};
            color: ${tabTextColor};
            font-size: ${fontSize * 1.5}px;
            font-weight: bold;
            z-index: 2;
        }
        .flipcard-back {
            background-color: ${tabContentBgColor};
            color: ${tabContentTextColor};
            transform: rotateY(180deg);
            padding: ${tabContentPadding}px;
            font-size: ${fontSize}px;
            overflow-y: auto;
            text-align: left;
        }
        .flipcard-content {
            width: 100%;
            max-height: 100%;
            overflow-y: auto;
        }
        .iframe-container {
            width: 100%;
            padding-top: 56.25%; /* 16:9 aspect ratio */
            position: relative;
            margin-top: 10px;
        }
        .iframe-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
    </style>
</head>
<body>
    <div class="flipcard-container">
        ${tabs
          .map(
            (tab, index) => `
        <div class="flipcard">
            <div class="flipcard-inner">
                <div class="flipcard-front">
                    ${tab.title}
                </div>
                <div class="flipcard-back">
                    <div class="flipcard-content">
                        ${tab.content
                          .split("\n")
                          .map((paragraph) => `<p>${paragraph}</p>`)
                          .join("")}
                        ${
                          tab.youtubeLink
                            ? `
                        <div class="iframe-container">
                            <iframe
                                loading="lazy"
                                src="${getYoutubeEmbedUrl(tab.youtubeLink)}"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                            ></iframe>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        </div>
        `,
          )
          .join("")}
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const flipcards = document.querySelectorAll('.flipcard');
            let currentlyFlippedCard = null;

            flipcards.forEach(card => {
                card.addEventListener('click', function() {
                    if (currentlyFlippedCard && currentlyFlippedCard !== this) {
                        currentlyFlippedCard.classList.remove('flipped');
                    }
                    
                    this.classList.toggle('flipped');
                    
                    if (this.classList.contains('flipped')) {
                        currentlyFlippedCard = this;
                    } else {
                        currentlyFlippedCard = null;
                    }
                });
            });
        });
    </script>
</body>
</html>
    `
        : isAccordionMode
          ? `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accordion Tabs</title>
    <style>
        body {
            font-family: ${fontFamily};
            margin: 0;
            padding: ${isFullPageLayout ? "0" : "20px"};
            background-color: #f0f0f0;
        }
        .accordion {
            box-sizing: border-box;
            display: flex;
            font-family: ${fontFamily};
            overflow: hidden;
            width: 100%;
            border-color: #393a50;
            border-radius: ${cornerRadius}px;
            border-style: solid;
            border-width: 0px;
            flex-direction: column;
            height: auto;
            ${isFullPageLayout ? "" : `max-width: 800px; margin: 0 auto;`}
        }
        .accordion-select {
            cursor: pointer;
            margin: 0;
            opacity: 0;
            z-index: 1;
        }
        .accordion-title {
            position: relative;
        }
        .accordion-title:not(:nth-last-child(2))::after {
            border: 1px solid transparent;
            bottom: 0;
            content: "";
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
        }
        .accordion-title span {
            bottom: 0px;
            box-sizing: border-box;
            display: block;
            position: absolute;
            white-space: nowrap;
            width: 100%;
        }
        .accordion-content {
            background-color: ${tabContentBgColor};
            color: ${tabContentTextColor};
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out, padding 0.3s ease-out;
            padding: 0 ${tabContentPadding}px;
            width: 100%;
        }
        .accordion-select:checked + .accordion-title + .accordion-content {
            max-height: 1000px;
            padding: ${tabContentPadding}px;
        }
        .accordion-title,
        .accordion-select {
            background-color: ${tabBgColor};
            color: ${tabTextColor};
            width: 100%;
            height: ${tabHeight}px;
            font-size: ${fontSize}px;
        }
        .accordion-select {
            margin-bottom: -${tabHeight}px;
            margin-right: 0;
        }
        .accordion-title:not(:nth-last-child(2))::after {
            border-bottom-color: ${titleBorderColor};
            border-right-color: transparent;
        }
        .accordion-select:hover + .accordion-title,
        .accordion-select:checked + .accordion-title {
            background-color: ${activeTabBgColor};
        }
        .accordion-title span {
            transform: rotate(0deg);
            -ms-writing-mode: lr-tb;
            filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=0);
            padding-left: ${tabContentPadding}px;
            padding-right: ${tabContentPadding}px;
            line-height: ${tabHeight}px;
        }

        .iframe-container {
          overflow: hidden;
          padding-top: 56.25%;
          position: relative;
          margin-top: 20px;
        }

        .iframe-container iframe {
          border: 0;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
    </style>
</head>
<body>
    <div class="accordion">
        ${tabs
          .map(
            (tab, index) => `
        <input type="radio" name="accordion" class="accordion-select" id="tab${index + 1}" ${
          index === 0 ? "checked" : ""
        }>
        <div class="accordion-title"><span>${tab.title}</span></div>
        <div class="accordion-content">
            ${tab.content
              .split("\n")
              .map((paragraph) => `<p>${paragraph}</p>`)
              .join("")}
            ${
              tab.youtubeLink
                ? `
            <div class="iframe-container">
                <iframe
                    loading="lazy"
                    src="${getYoutubeEmbedUrl(tab.youtubeLink)}"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            </div>
            `
                : ""
            }
        </div>
        `,
          )
          .join("")}
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const accordionSelects = document.querySelectorAll('.accordion-select');
            accordionSelects.forEach(select => {
                select.addEventListener('change', function() {
                    const content = this.nextElementSibling.nextElementSibling;
                    if (this.checked) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0';
                    }
                    
                    // Close other tabs
                    accordionSelects.forEach(otherSelect => {
                        if (otherSelect !== this) {
                            otherSelect.checked = false;
                            otherSelect.nextElementSibling.nextElementSibling.style.maxHeight = '0';
                        }
                    });
                });
            });
        });
    </script>
</body>
</html>
`
          : `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Tabs</title>
    <style>
        body {
            font-family: ${fontFamily};
            margin: 0;
            padding: ${isFullPageLayout ? "0" : "20px"};
            background-color: #f0f0f0;
        }
        .tab-container {
            width: 100%;
            ${isFullPageLayout ? "" : "max-width: 800px;"}
            margin: 0 auto;
            background-color: #ffffff;
            ${
              isFullPageLayout
                ? ""
                : `
            border: 1px solid #ccc;
            border-radius: ${cornerRadius}px;
            box-shadow: 0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 0, 0, ${shadowIntensity * 0.1});
            `
            }
            overflow: hidden;
            display: flex;
            flex-direction: ${tabPosition === "bottom" ? "column-reverse" : tabPosition === "top" ? "column" : "row"};
            ${tabPosition === "right" ? "flex-direction: row-reverse;" : ""}
        }
        .tab-nav {
            display: flex;
            background-color: ${tabTitleGroupBgColor};
            flex-direction: ${tabPosition === "top" || tabPosition === "bottom" ? "row" : "column"};
            ${
              tabPosition !== "top" && tabPosition !== "bottom"
                ? `
            width: 200px;
            flex-shrink: 0;
            ${tabPosition === "left" ? "align-items: flex-start;" : "align-items: flex-end;"}
            `
                : ""
            }
        }
        .tab-label {
            ${
              tabPosition === "top" || tabPosition === "bottom"
                ? `
            flex: 1;
            text-align: center;
            padding: 0;
            height: ${tabHeight}px;
            line-height: ${tabHeight}px;
            `
                : `
            width: 100%;
            height: ${tabHeight}px;
            line-height: ${tabHeight}px;
            writing-mode: horizontal-tb;
            text-orientation: mixed;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: ${tabPosition === "left" ? "flex-start" : "flex-end"};
            text-align: ${tabPosition === "left" ? "left" : "right"};
            `
            }
            background-color: ${tabBgColor};
            color: ${tabTextColor};
            font-size: ${fontSize}px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-right: ${titleBorderSize}px solid ${titleBorderColor};
            box-shadow: ${titleDropShadowIntensity}px ${titleDropShadowIntensity}px ${titleDropShadowIntensity * 2}px rgba(0, 0, 0, 0.1);
            ${
              tabPosition === "left"
                ? `
              border-right: none;
              border-bottom: ${titleBorderSize}px solid ${titleBorderColor};
            `
                : tabPosition === "right"
                  ? `
              border-left: ${titleBorderSize}px solid ${titleBorderColor};
              border-right: none;
              border-bottom: ${titleBorderSize}px solid ${titleBorderColor};
            `
                  : tabPosition === "bottom"
                    ? `
              border-top: ${titleBorderSize}px solid ${titleBorderColor};
              border-right: none;
              border-bottom: none;
            `
                    : ""
            }
            ${
              tabPosition !== "top"
                ? `
              box-shadow: ${tabPosition === "left" ? `${titleDropShadowIntensity}px ${titleDropShadowIntensity}px` : tabPosition === "right" ? `-${titleDropShadowIntensity}px ${titleDropShadowIntensity}px` : `0 -${titleDropShadowIntensity}px ${titleDropShadowIntensity * 2}px`} rgba(0, 0, 0, 0.1);
            `
                : ""
            }
        }
        .tab-select {
            display: none;
        }
        .tab-content-container {
            flex: 1;
            ${tabPosition !== "top" && tabPosition !== "bottom" ? "height: 400px; overflow-y: auto;" : ""}
            ${tabPosition === "left" ? "order: 1;" : ""}
            ${tabPosition === "right" ? "order: 0;" : ""}
        }
        .tab-content {
            padding: ${tabContentPadding}px;
            background-color: ${tabContentBgColor};
            color: ${tabContentTextColor};
            height: ${isAutoHeight ? "auto" : `${tabContentHeight}px`};
            min-height: ${isAutoHeight ? "auto" : `${tabContentHeight}px`};
            overflow-y: auto;
            display: none;
            text-align: left;
            ${
              isAnimated
                ? `
            opacity: 0;
            transition: opacity 0.2s ease-out${selectedTheme === "dark" ? ", background-color 0.2s ease-out" : ""};
            `
                : ""
            }
        }
        .tab-content.active {
            display: block;
            ${
              isAnimated
                ? `
            opacity: 1;
            `
                : ""
            }
        }
        ${
          isFullPageLayout
            ? ""
            : `
        .tab-label:first-of-type {
            border-${tabPosition === "bottom" ? "bottom" : "top"}-left-radius: ${cornerRadius}px;
        }
        .tab-label:last-of-type {
            border-${tabPosition === "bottom" ? "bottom" : "top"}-right-radius: ${cornerRadius}px;
        }
        `
        }
        .iframe-container {
          overflow: hidden;
          padding-top: 56.25%;
          position: relative;
        }

        .iframe-container iframe {
          border: 0;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
    </style>
</head>
<body>
    <div class="tab-container">
        <div class="tab-nav">
            ${tabs
              .map(
                (tab, index) => `
            <input type="radio" name="tabs" id="tab${index + 1}" class="tab-select" ${index === 0 ? "checked" : ""}>
            <label for="tab${index + 1}" class="tab-label">${tab.title}</label>
            `,
              )
              .join("")}
        </div>
        <div class="tab-content-container">
            ${tabs
              .map(
                (tab, index) => `
<div class="tab-content" data-tab-content="tab${index + 1}">
    ${tab.content
      .split("\n")
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("")}
    ${
      tab.youtubeLink
        ? `
    <div class="iframe-container">
      <iframe 
        loading="lazy"
        src="${getYoutubeEmbedUrl(tab.youtubeLink)}" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen
      ></iframe>
    </div>
    `
        : ""
    }
</div>
`,
              )
              .join("")}
        </div>
    </div>
    <script>
  const isAnimated = ${isAnimated};
  const isDarkTheme = ${selectedTheme === "dark"};
  document.addEventListener('DOMContentLoaded', function() {
    const tabSelects = document.querySelectorAll('.tab-select');
    tabSelects.forEach(input => {
      input.addEventListener('change', function() {
        const activeContent = document.querySelector('.tab-content.active');
        if (activeContent) {
          activeContent.style.opacity = '0';
          if (isDarkTheme) {
            activeContent.style.backgroundColor = '${tabBgColor}';
          }
          setTimeout(() => {
            activeContent.style.display = 'none';
            activeContent.classList.remove('active');
          }, 200);
        }

        const newContent = document.querySelector('.tab-content[data-tab-content="tab' + this.id.slice(-1) + '"]');
        if (newContent) {
          setTimeout(() => {
            newContent.style.display = 'block';
            newContent.classList.add('active');
            requestAnimationFrame(() => {
              newContent.style.opacity = '1';
              if (isDarkTheme) {
                newContent.style.backgroundColor = '${tabContentBgColor}';
              }
            });
          }, 210);        }

        // Update tab styles
        const tabLabels = document.querySelectorAll('.tab-label');
        tabLabels.forEach(label => {
          label.style.backgroundColor = '${tabBgColor}';
          label.style.boxShadow = '${titleDropShadowIntensity}px ${titleDropShadowIntensity}px ${titleDropShadowIntensity * 2}px rgba(0, 0, 0, 0.1)';
        });

        this.nextElementSibling.style.backgroundColor = '${activeTabBgColor}';
        this.nextElementSibling.style.boxShadow = '${tabPosition === "bottom" ? `0 -${titleDropShadowIntensity}px ${titleDropShadowIntensity * 2}px rgba(0, 0, 0, 0.2)` : `${titleDropShadowIntensity}px ${titleDropShadowIntensity * 2}px rgba(0, 0, 0, 0.2)`}';
      });
    });

    // Set initial active tab
    const initialActiveTab = document.querySelector('.tab-select:checked');
    if (initialActiveTab) {
      initialActiveTab.dispatchEvent(new Event('change'));
    }
  });
</script>
</body>
</html>
    `
    return html
  }

  const updatePreviewHtml = () => {
    const newHtml = generateHTML()
    setPreviewHtml(newHtml)
    setEditableHtml(newHtml)
    // Force re-render of the preview iframe
    const previewIframe = document.querySelector('iframe[title="Tab Preview"]') as HTMLIFrameElement
    if (previewIframe) {
      previewIframe.srcdoc = newHtml
      // Trigger a resize event to ensure the iframe content is properly laid out
      setTimeout(() => {
        previewIframe.contentWindow?.dispatchEvent(new Event("resize"))
      }, 100)
    }
  }

  useEffect(() => {
    updatePreviewHtml()
  }, [
    tabs,
    tabBgColor,
    activeTabBgColor,
    tabTextColor,
    tabContentBgColor,
    tabContentTextColor,
    cornerRadius,
    shadowIntensity,
    isFullPageLayout,
    tabHeight,
    fontSize,
    tabContentPadding,
    tabContentHeight,
    isSliderMode,
    isAutoHeight,
    fontFamily,
    tabPosition,
    titleBorderSize,
    titleBorderColor,
    titleDropShadowIntensity,
    tabTitleGroupBgColor,
    tabCount,
    selectedTheme,
    isAnimated,
    isFlipCardMode,
    isAccordionMode,
  ])

  const handleCodeViewChange = (newHtml: string) => {
    setEditableHtml(newHtml)
    setPreviewHtml(newHtml)
  }

  const downloadHTML = () => {
    const blob = new Blob([previewHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "index.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const openPreviewModal = () => {
    setIsPreviewModalOpen(true)
  }

  const handleSliderModeChange = (value: boolean) => {
    setIsSliderMode(value)
    if (value) {
      setTabContentHeight(400)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You can add a toast notification here if you want to show a success message
      console.log("Text copied to clipboard")
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const toggleAccordionItem = (value: string) => {
    setOpenAccordionItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const toggleAllAccordionItems = () => {
    const allItems = ["colors", "layout", "typography", "effects"]
    setOpenAccordionItems((prev) => (prev.length === allItems.length ? [] : allItems))
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Tab Editor</h1>

      {/* Collapsible top menu */}
      <div className="mb-4">
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-full flex justify-between items-center">
          <span>Menu</span>
          {isMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isMenuOpen && (
          <div className="mt-2 p-4 border rounded">
            <p className="mb-2">v2.4</p>
            <Link href="/about" className="text-blue-500 hover:underline">
              About
            </Link>
          </div>
        )}
      </div>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left column */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Configure & Edit Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="tab-count">Add/Remove: {tabCount}</Label>
                <Slider
                  id="tab-count"
                  min={1}
                  max={10}
                  step={1}
                  value={[tabCount]}
                  onValueChange={(value) => handleTabCountChange(value[0])}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="tab-selector">Select Tab to Edit</Label>
                <select
                  id="tab-selector"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                >
                  {tabs.map((tab, index) => (
                    <option key={index} value={index.toString()}>
                      {tab.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="slider-mode"
                    checked={isSliderMode}
                    onCheckedChange={handleSliderModeChange}
                    disabled={isFlipCardMode || isAccordionMode}
                  />
                  <Label htmlFor="slider-mode">Slider Mode</Label>
                </div>
                {(isFlipCardMode || isAccordionMode) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Slider Mode is not available when Flipcard Mode or Accordion Mode is active.
                  </p>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flipcard-mode"
                    checked={isFlipCardMode}
                    onCheckedChange={(checked) => {
                      setIsFlipCardMode(checked)
                      if (checked) {
                        setTabPosition("top")
                      }
                    }}
                    disabled={isSliderMode || isAccordionMode}
                  />
                  <Label htmlFor="flipcard-mode">Flipcard Mode</Label>
                </div>
                {(isSliderMode || isAccordionMode) && (
                  <p className="text-sm textmuted-foreground mt-1">
                    Flipcard Mode is not available when Slider Mode or Accordion Mode is active.
                  </p>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="accordion-mode"
                    checked={isAccordionMode}
                    onCheckedChange={(checked) => {
                      setIsAccordionMode(checked)
                      if (checked) {
                        setIsSliderMode(false)
                        setIsFlipCardMode(false)
                        setTabPosition("top")
                      }
                    }}
                    disabled={isSliderMode || isFlipCardMode}
                  />
                  <Label htmlFor="accordion-mode">Accordion Mode</Label>
                </div>
                {(isSliderMode || isFlipCardMode) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Accordion Mode is not available when Slider Mode or Flipcard Mode is active.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="tab-position">TabPosition</Label>
                <select
                  id="tab-position"
                  value={tabPosition}
                  onChange={(e) => setTabPosition(e.target.value as "top" | "left" | "right" | "bottom")}
                  className="w-full p-2 border rounded mt-1"
                  disabled={isFlipCardMode || isAccordionMode}
                >
                  <option value="top">Top</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="bottom">Bottom</option>
                </select>
                {(isFlipCardMode || isAccordionMode) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Tab position is not applicable in Flipcard Mode or Accordion Mode.
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tab-title">Tab Title</Label>{" "}
                  <Input
                    id="tab-title"
                    value={tabs[Number.parseInt(activeTab)].title}
                    onChange={(e) => handleTabChange(e.target.value, Number.parseInt(activeTab))}
                  />
                </div>
                <div>
                  <Label htmlFor="tab-content">Tab Content</Label>
                  <Textarea
                    id="tab-content"
                    value={tabs[Number.parseInt(activeTab)].content}
                    onChange={(e) => handleContentChange(e.target.value, Number.parseInt(activeTab))}
                    rows={10}
                  />
                </div>
                <div>
                  <Label htmlFor="youtube-link">YouTube Video Link</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="youtube-link"
                      value={tabs[Number.parseInt(activeTab)].youtubeLink}
                      onChange={(e) => handleYoutubeLinkChange(e.target.value, Number.parseInt(activeTab))}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <Button
                      onClick={() => {
                        if (tabs[Number.parseInt(activeTab)].youtubeLink) {
                          handleYoutubeLinkChange(
                            tabs[Number.parseInt(activeTab)].youtubeLink,
                            Number.parseInt(activeTab),
                          )
                        }
                      }}
                    >
                      Insert Video
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={downloadHTML}>
                Generate and Download HTML
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle column */}
        <div className="w-full md:w-1/2">
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="code-view" checked={isCodeView} onCheckedChange={setIsCodeView} />
                    <Label htmlFor="code-view" className="text-sm">
                      Code View
                    </Label>
                  </div>
                  <Button onClick={openPreviewModal} variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <div className="flex items-center space-x-2">{/* Removed Add and Remove Tab buttons */}</div>
              </div>
              <div className="border rounded">
                <div className="p-4">{/* Tab content will be displayed here */}</div>
                <div className="h-auto">
                  {isCodeView ? (
                    <div className="relative">
                      <Textarea
                        value={editableHtml}
                        onChange={(e) => handleCodeViewChange(e.target.value)}
                        className="w-full h-full font-mono text-sm p-4 pr-12"
                        spellCheck={false}
                      />
                      <Button
                        className="absolute top-2 right-2"
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(editableHtml)}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={previewHtml}
                      title="Tab Preview"
                      className="w-full h-[600px]"
                      style={{ minHeight: "800px" }}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Style Tabs
                <Button onClick={toggleAllAccordionItems} variant="outline" size="sm" className="ml-2 bg-transparent">
                  {openAccordionItems.length === 4 ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Expand All
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                value={openAccordionItems}
                onValueChange={setOpenAccordionItems}
                className="w-full"
              >
                <AccordionItem value="colors">
                  <AccordionTrigger onClick={() => toggleAccordionItem("colors")}>Colors</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-semibold">Themes</Label>
                        <RadioGroup
                          value={selectedTheme}
                          onValueChange={(value: "custom" | "light" | "dark") => {
                            if (value === "light" || value === "dark") {
                              applyTheme(value)
                            } else {
                              setSelectedTheme("custom")
                            }
                          }}
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light">Light</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark">Dark</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">Custom</Label>
                          </div>{" "}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>Tab Background</Label>
                        <ColorPicker
                          color={tabBgColor}
                          onChange={(color) => {
                            setTabBgColor(color)
                            setSelectedTheme("custom")
                          }}
                        />
                      </div>
                      <div>
                        <Label>Active Tab Background</Label>
                        <ColorPicker
                          color={activeTabBgColor}
                          onChange={(color) => {
                            setActiveTabBgColor(color)
                            setSelectedTheme("custom")
                          }}
                        />
                      </div>
                      <div>
                        <Label>Tab Text</Label>
                        <ColorPicker
                          color={tabTextColor}
                          onChange={(color) => {
                            setTabTextColor(color)
                            setSelectedTheme("custom")
                          }}
                        />
                      </div>
                      <div>
                        <Label>Content Background</Label>
                        <ColorPicker
                          color={tabContentBgColor}
                          onChange={(color) => {
                            setTabContentBgColor(color)
                            setSelectedTheme("custom")
                          }}
                        />
                      </div>
                      <div>
                        <Label>Content Text</Label>
                        <ColorPicker
                          color={tabContentTextColor}
                          onChange={(color) => {
                            setTabContentTextColor(color)
                            setSelectedTheme("custom")
                          }}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="layout">
                  <AccordionTrigger onClick={() => toggleAccordionItem("layout")}>Layout</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id="full-page-layout"
                          checked={isFullPageLayout}
                          onCheckedChange={(value) => setIsFullPageLayout(value)}
                          disabled={isFlipCardMode || isAccordionMode}
                        />
                        <Label htmlFor="full-page-layout">Full Page Layout</Label>
                        {(isFlipCardMode || isAccordionMode) && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Full Page Layout is not applicable in Flipcard Mode or Accordion Mode.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Tab Height: {tabHeight}px</Label>
                        <Slider
                          min={30}
                          max={100}
                          step={1}
                          value={[tabHeight]}
                          onValueChange={(value) => setTabHeight(value[0])}
                          disabled={isFlipCardMode || isAccordionMode}
                        />
                        {(isFlipCardMode || isAccordionMode) && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Tab Height is not adjustable in Flipcard Mode or Accordion Mode.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Content Height: {isAutoHeight ? "Auto" : `${tabContentHeight}px`}</Label>
                        <Slider
                          min={100}
                          max={500}
                          step={10}
                          value={[tabContentHeight]}
                          onValueChange={(value) => setTabContentHeight(value[0])}
                          disabled={isAutoHeight || isSliderMode || isFlipCardMode || isAccordionMode}
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="auto-height"
                            checked={isAutoHeight}
                            onCheckedChange={setIsAutoHeight}
                            disabled={isFlipCardMode || isAccordionMode}
                          />
                          <Label htmlFor="auto-height">Auto Height</Label>
                        </div>
                        {(isFlipCardMode || isAccordionMode) && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Content Height is fixed in Flipcard Mode and Accordion Mode.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Content Padding: {tabContentPadding}px</Label>
                        <Slider
                          min={0}
                          max={50}
                          step={1}
                          value={[tabContentPadding]}
                          onValueChange={(value) => setTabContentPadding(value[0])}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="typography">
                  <AccordionTrigger onClick={() => toggleAccordionItem("typography")}>Typography</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="font-family">Font Family</Label>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                            <SelectItem value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</SelectItem>
                            <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                            <SelectItem value="Georgia, serif">Georgia</SelectItem>
                            <SelectItem value="'Courier New', Courier, monospace">Courier New</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider
                          min={12}
                          max={24}
                          step={1}
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="effects">
                  <AccordionTrigger onClick={() => toggleAccordionItem("effects")}>Effects</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Corner Radius: {cornerRadius}px</Label>
                        <Slider
                          min={0}
                          max={20}
                          step={1}
                          value={[cornerRadius]}
                          onValueChange={(value) => setCornerRadius(value[0])}
                        />
                      </div>
                      <div>
                        <Label>Drop Shadow: {shadowIntensity}px</Label>
                        <Slider
                          min={0}
                          max={20}
                          step={1}
                          value={[shadowIntensity]}
                          onValueChange={(value) => setShadowIntensity(value[0])}
                        />
                      </div>
                      <div>
                        <Label>Title Border Size: {titleBorderSize}px</Label>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[titleBorderSize]}
                          onValueChange={(value) => setTitleBorderSize(value[0])}
                          disabled={isAccordionMode}
                        />
                        {isAccordionMode && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Title Border Size is not applicable in Accordion Mode.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Title Border Color</Label>
                        <ColorPicker
                          color={titleBorderColor}
                          onChange={setTitleBorderColor}
                          disabled={isAccordionMode}
                        />
                        {isAccordionMode && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Title Border Color is not applicable in Accordion Mode.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Title Drop Shadow: {titleDropShadowIntensity}px</Label>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[titleDropShadowIntensity]}
                          onValueChange={(value) => setTitleDropShadowIntensity(value[0])}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="animation-toggle"
                          checked={isAnimated}
                          onCheckedChange={setIsAnimated}
                          disabled={isAccordionMode}
                        />
                        <Label htmlFor="animation-toggle">Enable Animations</Label>
                        {isAccordionMode && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Animations are handled differently in Accordion Mode.
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
      <ResizablePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        content={previewHtml}
      />
    </div>
  )
}

const ResizablePreviewModal = ({ isOpen, onClose, content }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <DialogDescription className="sr-only">Preview of the custom tab layout</DialogDescription>
        <Resizable defaultSize={{ width: "80vw", height: "80vh" }} minWidth="400px" minHeight="300px">
          <div className="w-full h-full overflow-auto">
            <iframe
              srcDoc={content}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-sameorigin allow-popups allow-poups-to-escape-sandbox"
            />
          </div>
        </Resizable>
      </DialogContent>
    </Dialog>
  )
}
