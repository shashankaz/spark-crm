import { useState, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Strikethrough,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";

const exec = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

const ToolbarBtn = ({
  onMouseDown,
  active,
  title,
  children,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={onMouseDown}
    className={`p-1.5 rounded text-sm transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "hover:bg-muted text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-border mx-0.5" />;

type FormatState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  blockquote: boolean;
};

const getFormatState = (): FormatState => ({
  bold: document.queryCommandState("bold"),
  italic: document.queryCommandState("italic"),
  underline: document.queryCommandState("underline"),
  strikethrough: document.queryCommandState("strikethrough"),
  orderedList: document.queryCommandState("insertOrderedList"),
  unorderedList: document.queryCommandState("insertUnorderedList"),
  blockquote: !!window
    .getSelection()
    ?.anchorNode?.parentElement?.closest("blockquote"),
});

export interface RichEditorProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (html: string, text: string) => void;
}

export const RichEditor = ({
  editorRef,
  placeholder,
  defaultValue,
  onChange,
}: RichEditorProps) => {
  const [fmt, setFmt] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    orderedList: false,
    unorderedList: false,
    blockquote: false,
  });

  const [isEmpty, setIsEmpty] = useState(!defaultValue);

  const handleSelectionChange = useCallback(() => {
    setFmt(getFormatState());
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  useEffect(() => {
    if (editorRef.current && defaultValue && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = defaultValue;
      setIsEmpty(false);
    }
  }, [defaultValue, editorRef]);

  const cmd = useCallback(
    (command: string, value?: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      if (editorRef.current) editorRef.current.focus();
      exec(command, value);
      setTimeout(() => setFmt(getFormatState()), 0);
      if (onChange && editorRef.current) {
        onChange(
          editorRef.current.innerHTML,
          editorRef.current.textContent || "",
        );
      }
    },
    [editorRef, onChange],
  );

  const insertLink = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (editorRef.current) editorRef.current.focus();
      const url = window.prompt("Enter URL:");
      if (url) exec("createLink", url);
      if (onChange && editorRef.current) {
        onChange(
          editorRef.current.innerHTML,
          editorRef.current.textContent || "",
        );
      }
    },
    [editorRef, onChange],
  );

  const insertBlockquote = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (editorRef.current) editorRef.current.focus();
      const sel = window.getSelection();
      const inBQ = !!sel?.anchorNode?.parentElement?.closest("blockquote");
      if (inBQ) {
        exec("outdent");
        exec("outdent");
      } else {
        exec("indent");
        exec("formatBlock", "blockquote");
      }
      setTimeout(() => setFmt(getFormatState()), 0);
      if (onChange && editorRef.current) {
        onChange(
          editorRef.current.innerHTML,
          editorRef.current.textContent || "",
        );
      }
    },
    [editorRef, onChange],
  );

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const text = (target.textContent ?? "").trim();
    setIsEmpty(text.length === 0);
    if (onChange) {
      onChange(target.innerHTML, target.textContent || "");
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-muted/30">
        <ToolbarBtn title="Bold" onMouseDown={cmd("bold")} active={fmt.bold}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Italic"
          onMouseDown={cmd("italic")}
          active={fmt.italic}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Underline"
          onMouseDown={cmd("underline")}
          active={fmt.underline}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Strikethrough"
          onMouseDown={cmd("strikethrough")}
          active={fmt.strikethrough}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          title="Bullet List"
          onMouseDown={cmd("insertUnorderedList")}
          active={fmt.unorderedList}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Numbered List"
          onMouseDown={cmd("insertOrderedList")}
          active={fmt.orderedList}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Blockquote"
          onMouseDown={insertBlockquote}
          active={fmt.blockquote}
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn title="Align Left" onMouseDown={cmd("justifyLeft")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Center" onMouseDown={cmd("justifyCenter")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Right" onMouseDown={cmd("justifyRight")}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn title="Insert Link" onMouseDown={insertLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn title="Undo" onMouseDown={cmd("undo")}>
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" onMouseDown={cmd("redo")}>
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      <div className="relative">
        {isEmpty && (
          <p className="absolute top-3 left-4 text-sm text-muted-foreground pointer-events-none select-none">
            {placeholder ?? "Write your email message here..."}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-50 px-4 py-3 text-sm outline-none rich-editor-content"
          onInput={handleInput}
          onKeyUp={() => setFmt(getFormatState())}
          style={{ lineHeight: "1.6" }}
        />
      </div>
    </div>
  );
};
