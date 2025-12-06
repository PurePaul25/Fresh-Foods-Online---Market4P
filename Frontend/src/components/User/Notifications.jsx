"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  fetchUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService"
import { Bell, Check, CheckCheck, Trash2, RefreshCw, AlertCircle, Sparkles } from "lucide-react"
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const Notifications = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Fetching notifications with filter:", filter, "page:", page)
      const response = await fetchUserNotifications(filter, page, 10)
      console.log("[v0] Full API response:", response)
      console.log("[v0] Response type:", typeof response)
      console.log("[v0] Response keys:", response ? Object.keys(response) : "null")

      if (response.error) {
        console.log("[v0] Response has error:", response.error, response.message)
        if (response.message?.includes("access token") || response.status === 401) {
          setError("Vui lòng đăng nhập để xem thông báo")
          setTimeout(() => navigate("/login"), 2000)
          return
        }
        setError(response.message || "Có lỗi xảy ra")
        return
      }

      const notificationData = response.notifications || response.data?.notifications || response.data || []
      console.log("[v0] Notification data extracted:", notificationData)
      console.log("[v0] Notification count:", notificationData.length)

      setNotifications(notificationData)
      setPagination(response.pagination || response.data?.pagination || null)
    } catch (err) {
      console.error("[v0] Error loading notifications:", err)
      if (err.message?.includes("access token") || err.status === 401) {
        setError("Vui lòng đăng nhập để xem thông báo")
        setTimeout(() => navigate("/login"), 2000)
      } else {
        setError(err.message || "Không thể tải thông báo")
      }
    } finally {
      setLoading(false)
    }
  }, [filter, page, navigate])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
    } catch (err) {
      console.error("Error marking as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) {
      console.error("Error marking all as read:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
    } catch (err) {
      console.error("Error deleting notification:", err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "broadcast":
        return <Sparkles className="w-5 h-5 text-amber-600" />
      case "order":
        return <Bell className="w-5 h-5 text-amber-600" />
      case "promotion":
        return <Sparkles className="w-5 h-5 text-amber-600" />
      default:
        return <Bell className="w-5 h-5 text-amber-600" />
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              <Bell className="w-6 h-6 text-amber-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="mt-4 text-gray-600 font-medium">Đang tải thông báo...</span>
          </div>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div>
      <Navbar></Navbar>
      <div className="pt-25  min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
                  <p className="text-sm text-gray-500">
                    {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Tất cả đã đọc"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Đánh dấu tất cả</span>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tất cả", icon: Bell },
                { value: "broadcast", label: "Thông báo chung", icon: Sparkles },
                { value: "order", label: "Đơn hàng", icon: Bell },
                { value: "promotion", label: "Khuyến mãi", icon: Sparkles }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilter(value)
                    setPage(1)
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${filter === value
                    ? "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications list */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-12 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-amber-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có thông báo</h3>
                <p className="text-gray-500">Bạn chưa có thông báo nào trong mục này</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-white rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${notification.isRead
                    ? "border-gray-200"
                    : "border-amber-300 bg-linear-to-r from-amber-50 to-white"
                    }`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${notification.isRead ? "bg-gray-100" : "bg-amber-100"
                        }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{notification.message}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Đánh dấu đã đọc"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                          {notification.type === "broadcast" && (
                            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                              Thông báo chung
                            </span>
                          )}
                          {notification.type === "promotion" && (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                              Khuyến mãi
                            </span>
                          )}
                          {notification.type === "order" && (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                              Đơn hàng
                            </span>
                          )}
                          {!notification.isRead && (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                              Chưa đọc
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4 mt-6">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Trước
                </button>
                <div className="px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium text-sm shadow-md">
                  {page} / {pagination.totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>

  )
}

export default Notifications