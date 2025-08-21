"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { Analytics } from "@/components/analytics"
import { GroupManagement } from "@/components/group-management"
import { Settings } from "@/components/settings"
import { CreateGroupModal } from "@/components/create-group-modal"
import { Footer } from "@/components/footer"
import { CivicToast } from "@/components/civic-toast"
import { useUser } from "@civic/auth-web3/react"

export default function SplitChainApp() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "group" | "analytics" | "settings">(
    "landing",
  )
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<'login' | 'logout'>('login')
  const [showToast, setShowToast] = useState(false)
  const { user } = useUser()

  // Track previous user state to detect login/logout changes
  const [prevUser, setPrevUser] = useState(user)

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    console.log("User state changed:", { user: !!user, prevUser: !!prevUser })
    
    // Check if user state changed
    if (user && !prevUser) {
      // User just logged in
      console.log("User logged in - showing toast")
      setCurrentPage("dashboard")
      setToastMessage("Successfully logged in with Civic")
      setToastType('login')
      setShowToast(true)
    } else if (!user && prevUser) {
      // User just logged out
      console.log("User logged out - showing toast")
      setCurrentPage("landing")
      setToastMessage("Successfully logged out from Civic")
      setToastType('logout')
      setShowToast(true)
    } else if (user) {
      // User is already logged in (page refresh or initial load)
      console.log("User already logged in")
      setCurrentPage("dashboard")
    } else {
      // User is not logged in
      console.log("User not logged in")
      setCurrentPage("landing")
    }

    // Update previous user state
    setPrevUser(user)
  }, [user, prevUser])

  // Removed handleAuthConnect since Civic manages its own auth state

  const handlePageChange = (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => {
    setCurrentPage(page)
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
  }

  return (
    <div className="min-h-screen matrix-bg">
      <CivicToast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {currentPage === "landing" && (
        <LandingPage onPageChange={handlePageChange} />
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
