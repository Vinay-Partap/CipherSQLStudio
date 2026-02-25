import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import './SqlEditor.scss';

function SqlEditor({ value, onChange, onExecute, isExecuting }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // SQL keywords for autocomplete
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => ({
        suggestions: [
          'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'UPDATE', 'DELETE',
          'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON',
          'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
          'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'AS', 'DISTINCT'
        ].map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword
        }))
      })
    });

    // Ctrl+Enter to run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute();
    });
  }

  return (
    <div className="sql-editor">
      <div className="sql-editor__toolbar">
        <span className="sql-editor__label">SQL Editor</span>
        <button 
          className="sql-editor__run-btn"
          onClick={onExecute}
          disabled={isExecuting || !value.trim()}
        >
          {isExecuting ? 'Running...' : '▶ Run (Ctrl+Enter)'}
        </button>
      </div>
      
      <div className="sql-editor__container">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true
          }}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}

export default SqlEditor;