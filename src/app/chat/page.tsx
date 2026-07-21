"use client";

import { useState } from "react";
import { ChatTemplate } from "@/templates/ChatTemplate";
import { ReportBuilderModal } from "@/components/organisms/ReportBuilderModal";
import { ChatToast } from "@/components/molecules/ChatToast";
import { useChat } from "@/hooks/useChat";
import { useChatActions } from "@/hooks/useChatActions";

/* Chat — the full-page threaded copilot. A book-wide question returns an MCP app
   (a live Widget) that can be saved to the library or opened in the shared
   report editor. The right-docked assistant is the summonable companion sharing
   this same conversation store. */
export default function ChatPage() {
  const data = useChat();
  const [collapsed, setCollapsed] = useState(false);
  const { lens, editing, openEdit, closeEdit, toast, saveReport, forkReport } = useChatActions();

  return (
    <>
      <ChatTemplate
        data={data}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onSave={saveReport}
        onEdit={openEdit}
      />
      <ReportBuilderModal open={!!editing} onClose={closeEdit} report={editing} lens={lens} onSave={forkReport} />
      <ChatToast message={toast} />
    </>
  );
}
