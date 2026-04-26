"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link2,
  Link2Off,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Eye,
  PenLine,
} from "lucide-react";
import { useEffect, useCallback, useState } from "react";

const lowlight = createLowlight(common);

// ── Toolbar Button ──
const ToolbarBtn = ({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-lg transition-all text-sm ${
      active
        ? "bg-[#22c55e] text-white shadow-sm"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
  error = false,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        codeBlock: false, // diganti oleh CodeBlockLowlight
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#22c55e] underline cursor-pointer" },
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[280px] px-4 py-3 focus:outline-none text-gray-800",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={`rounded-xl border-2 overflow-hidden transition-all ${
        error
          ? "border-red-300"
          : "border-gray-200 focus-within:border-[#22c55e]"
      }`}
    >
      {/* ── Top Bar: Toolbar + Mode Toggle ── */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2 gap-2">
        {/* Toolbar — sembunyikan saat preview */}
        <div
          className={`flex flex-wrap items-center gap-0.5 transition-opacity ${mode === "preview" ? "opacity-30 pointer-events-none" : "opacity-100"}`}
        >
          {/* Headings */}
          <ToolbarBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="H1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="H2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="H3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="w-4 h-4" />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={setLink}
            active={editor.isActive("link")}
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarBtn>
          {editor.isActive("link") && (
            <ToolbarBtn
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <Link2Off className="w-4 h-4" />
            </ToolbarBtn>
          )}
          <Divider />
          <ToolbarBtn
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        {/* Write / Preview Toggle */}
        <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "write"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            Tulis
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "preview"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* ── Editor / Preview Area ── */}
      <div className="bg-white min-h-[280px]">
        {mode === "write" ? (
          <EditorContent editor={editor} />
        ) : (
          /* Preview — render HTML dari editor */
          <div
            className="prose prose-sm max-w-none px-4 py-3 min-h-[280px] text-gray-800 preview-content"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {mode === "preview" ? (
            <span className="flex items-center gap-1 text-[#22c55e] font-medium">
              <Eye className="w-3 h-3" /> Mode Preview
            </span>
          ) : (
            "Mode Tulis"
          )}
        </span>
        <span className="text-xs text-gray-400">
          {editor.getText().length} karakter
        </span>
      </div>
    </div>
  );
}
