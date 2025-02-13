// Editor.tsx
import React, { useCallback, useEffect, useState } from 'react'
import {
  createEditor,
  Descendant,
  Editor,
  Node,
  Transforms,
  Text,
} from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'

// ======================================================
// Custom Types & Module Augmentation
// ======================================================
type CustomText = {
  text: string
  bold?: true
  italic?: true
  underline?: true
  code?: true
}

type CustomElement = {
  type: 'paragraph' | 'heading' | 'checklist'
  checked?: boolean
  children: CustomText[]
}

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement
    Text: CustomText
  }
}

// ======================================================
// Initial Editor Value
// ======================================================
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing...' }],
  },
]

// ======================================================
// Main Editor Component
// ======================================================
const EditorComponent = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())))

  // ------------------------------------------------------
  // Render elements based on block type
  // ------------------------------------------------------
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'heading':
        return <h1 {...props.attributes}>{props.children}</h1>
      case 'checklist':
        return (
          <div
            {...props.attributes}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <input
              type="checkbox"
              checked={props.element.checked || false}
              onChange={(e) => {
                // Find the path to the checklist block
                const path = ReactEditor.findPath(editor, props.element)
                // Update the checked state
                Transforms.setNodes(
                  editor,
                  { checked: e.target.checked },
                  { at: path }
                )
              }}
            />
            {/* This empty span prevents the checkbox from interfering with text editing */}
            <span contentEditable={false} style={{ marginRight: '8px' }} />
            {props.children}
          </div>
        )
      default:
        return <p {...props.attributes}>{props.children}</p>
    }
  }, [editor])

  // ------------------------------------------------------
  // Render leaves for inline formatting
  // ------------------------------------------------------
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children } = props

    if (props.leaf.bold) {
      children = <strong>{children}</strong>
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>
    }
    if (props.leaf.underline) {
      children = <u>{children}</u>
    }
    if (props.leaf.code) {
      children = <code>{children}</code>
    }

    return <span {...props.attributes}>{children}</span>
  }, [])

  // ------------------------------------------------------
  // Handle Markdown-Style Shortcuts
  // ------------------------------------------------------
  const handleMarkdownShortcut = (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const { selection } = editor
    if (!selection) return false

    const [node] = Editor.node(editor, selection)
    const text = Node.string(node)

    // For headings: "# " shortcut
    if (text.startsWith('# ')) {
      // Remove the markdown characters
      Transforms.delete(editor, {
        at: {
          anchor: { path: selection.anchor.path, offset: 0 },
          focus: { path: selection.anchor.path, offset: 2 },
        },
      })
      Transforms.setNodes(editor, { type: 'heading' }, { at: selection })
      return true
    }

    // For bullet lists: "* " or "- " shortcut (currently converts to paragraph)
    if (text.startsWith('* ') || text.startsWith('- ')) {
      Transforms.delete(editor, {
        at: {
          anchor: { path: selection.anchor.path, offset: 0 },
          focus: { path: selection.anchor.path, offset: 2 },
        },
      })
      // You could set a "list" type here; for now, we keep it as a paragraph.
      Transforms.setNodes(editor, { type: 'paragraph' }, { at: selection })
      return true
    }

    // For checklists: "[] " shortcut
    if (text.startsWith('[] ')) {
      Transforms.delete(editor, {
        at: {
          anchor: { path: selection.anchor.path, offset: 0 },
          focus: { path: selection.anchor.path, offset: 3 },
        },
      })
      Transforms.setNodes(editor, { type: 'checklist', checked: false }, { at: selection })
      return true
    }

    return false
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' && handleMarkdownShortcut(event)) {
      event.preventDefault()
      return
    }
    // Additional key handling (e.g. arrow navigation) can be added here.
  }

  // Add these styles near the top of the file, after imports
  const editorStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '20px',
    outline: 'none',
    fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={(value) => {}}>
      <Editable
        className="editor"
        style={editorStyles}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
        // placeholder="Start typing..."
      />
      <FloatingToolbar editor={editor} />
    </Slate>
  )
}

export default EditorComponent

// ======================================================
// Floating Toolbar Component
// ======================================================
interface FloatingToolbarProps {
  editor: Editor
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor }) => {
  const [position, setPosition] = useState<{ top: number; left: number; visible: boolean }>({
    top: 0,
    left: 0,
    visible: false,
  })

  useEffect(() => {
    const updatePosition = () => {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) {
        setPosition({ top: 0, left: 0, visible: false })
        return
      }
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setPosition({
        top: rect.top - 40,
        left: rect.left,
        visible: !sel.isCollapsed,
      })
    }

    document.addEventListener('selectionchange', updatePosition)
    return () => {
      document.removeEventListener('selectionchange', updatePosition)
    }
  }, [editor.selection])

  if (!position.visible) return null

  return (
    <div
      className="floating-toolbar"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        background: 'white',
        border: '1px solid #ddd',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      <FormatButton format="bold" label="B" editor={editor} />
      <BlockTypeSelect currentType="paragraph" editor={editor} />
      {/* Add more toolbar buttons as needed */}
    </div>
  )
}

// ======================================================
// Format Button Component (for inline formatting)
// ======================================================
interface FormatButtonProps {
  format: string
  label: string
  editor: Editor
}

const FormatButton: React.FC<FormatButtonProps> = ({ format, label, editor }) => {
  const toggleFormat = (format: string) => {
    const isActive = isFormatActive(editor, format)
    // Toggle the format on the current selection
    Transforms.setNodes(
      editor,
      { [format]: isActive ? undefined : true },
      { match: n => Text.isText(n), split: true }
    )
  }

  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault()
        toggleFormat(format)
      }}
      style={{ marginRight: '4px' }}
    >
      {label}
    </button>
  )
}

const isFormatActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => Text.isText(n) && n[format as keyof CustomText] === true,
    universal: true,
  })
  return !!match
}

// ======================================================
// Block Type Select Component
// ======================================================
interface BlockTypeSelectProps {
  currentType: string
  editor: Editor
}

const BlockTypeSelect: React.FC<BlockTypeSelectProps> = ({ currentType, editor }) => {
  const changeBlockType = (type: CustomElement['type']) => {
    Transforms.setNodes(editor, { type })
  }

  return (
    <select
      value={currentType}
      onChange={e => changeBlockType(e.target.value as CustomElement['type'])}
      style={{ marginLeft: '4px' }}
    >
      <option value="paragraph">Paragraph</option>
      <option value="heading">Heading</option>
      <option value="checklist">Checklist</option>
    </select>
  )
}
