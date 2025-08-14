import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { cn } from "../utils/cn";
import Placeholder from "@tiptap/extension-placeholder";

export default function TextEditor({ content = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Введите описание поста...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full border rounded-xl p-4 bg-white dark:bg-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 border-b pb-2">
        <ToolbarButton editor={editor} command="toggleBold" label="B" />
        <ToolbarButton editor={editor} command="toggleItalic" label="I" />
        <ToolbarButton editor={editor} command="toggleUnderline" label="U" />
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="[&_p]:p-2 [&_p]:bg-gray-100 [&_p]:rounded-md dark:[&_p]:bg-gray-600"
      />
    </div>
  );
}

function ToolbarButton({ editor, command, label, level }) {
  const isActive = () => {
    if (command === "toggleHeading") {
      return editor.isActive("heading", { level });
    }
    return editor.isActive(command.replace("toggle", "").toLowerCase());
  };

  const handleClick = () => {
    if (command === "toggleHeading") {
      editor.chain().focus()[command]({ level }).run();
    } else {
      editor.chain().focus()[command]().run();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "px-2 py-1 rounded text-sm border",
        isActive() ? "bg-gray-200 text-black" : "bg-blue-500 text-white"
      )}
    >
      {label}
    </button>
  );
}
