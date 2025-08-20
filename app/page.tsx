"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { Analytics } from "@/components/analytics"
import { GroupManagement } from "@/components/group-management"
import { Settings } from "@/components/settings"
import { CreateGroupModal } from "@/components/create-group-modal"
import { Footer } from "@/components/footer"
import { useUser } from "@civic/auth-web3/react"

export default function SplitChainApp() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "group" | "analytics" | "settings">(
    "landing",
  )
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const { user } = useUser()

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user) {
      setCurrentPage("dashboard")
    } else {
      // Redirect to landing page when user logs out
      setCurrentPage("landing")
    }
  }, [user])

  const handleAuthConnect = () => {
    // This will be called when user signs in successfully
    console.log("User authenticated, redirecting to dashboard")
    setCurrentPage("dashboard")
  }

  const handlePageChange = (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => {
    setCurrentPage(page)
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
  }

  return (
    <div className="min-h-screen matrix-bg">
      {currentPage === "landing" && (
        <LandingPage onWalletConnect={handleAuthConnect} onPageChange={handlePageChange} />
      )}

      {currentPage === "dashboard" && user && (
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
          onGroupCreated={() => {
            setShowCreateGroup(false)
          }}
        />
      )}
      <Footer onPageChange={handlePageChange} />
    </div>
  )
}
