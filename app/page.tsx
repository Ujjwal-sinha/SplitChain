"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { Analytics } from "@/components/analytics"
import { GroupManagement } from "@/components/group-management"
import { Settings } from "@/components/settings"
import { CreateGroupModal } from "@/components/create-group-modal"
import { WalletProvider } from "@/components/wallet-provider"
import { Footer } from "@/components/footer"

export default function SplitChainApp() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "group" | "analytics" | "settings">(
    "landing",
  )
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const handleWalletConnect = () => {
    setIsWalletConnected(true)
    setCurrentPage("dashboard")
  }

  const handlePageChange = (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => {
    if (page === "dashboard") {
      // When navigating to dashboard via the button, simulate wallet connection
      setIsWalletConnected(true)
      setCurrentPage("dashboard")
    } else if (page === "group") {
      // If navigating to group page, show group management instead
      setCurrentPage("group")
    } else {
      setCurrentPage(page)
    }
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
    // For now, we'll stay on the group management page
    // In a full implementation, you might have a separate group detail view
  }

  return (
    <WalletProvider>
      <div className="min-h-screen matrix-bg">
        {currentPage === "landing" && (
          <LandingPage onWalletConnect={handleWalletConnect} onPageChange={handlePageChange} />
        )}

        {currentPage === "dashboard" && isWalletConnected && (
          <Dashboard
            onPageChange={handlePageChange}
            onGroupSelect={handleGroupSelect}
            onCreateGroup={() => setShowCreateGroup(true)}
          />
        )}

        {currentPage === "group" && <GroupManagement onPageChange={handlePageChange} />}

        {currentPage === "analytics" && <Analytics onPageChange={handlePageChange} />}

        {currentPage === "settings" && <Settings onPageChange={handlePageChange} />}

        {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            onGroupCreated={(groupId) => {
              setShowCreateGroup(false)
              handleGroupSelect(groupId)
            }}
          />
        )}
        <Footer onPageChange={handlePageChange} />
      </div>
    </WalletProvider>
  )
}
