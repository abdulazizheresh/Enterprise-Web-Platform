<template>
  <div class="users-page">
    <AppHeaderView @toggle-sidebar="toggleSidebar" />
    <AppSidebarView :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">User Management</h1>
            <p class="page-subtitle">Manage users, roles, and permissions</p>
          </div>
          <button @click="showAddModal = true" class="add-btn">
            <UserPlusIcon class="icon" />
            Add User
          </button>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <div class="search-box">
            <MagnifyingGlassIcon class="search-icon" />
            <input v-model="searchQuery" type="text" placeholder="Search users..." class="search-input" />
          </div>

          <div class="filter-controls">
            <select v-model="roleFilter" class="filter-select">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>

            <select v-model="statusFilter" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <UsersIcon class="stat-icon" />
            <div class="stat-info">
              <span class="stat-value">{{ userStats.total }}</span>
              <span class="stat-label">Total Users</span>
            </div>
          </div>

          <div class="stat-card">
            <CheckCircleIcon class="stat-icon active" />
            <div class="stat-info">
              <span class="stat-value">{{ userStats.active }}</span>
              <span class="stat-label">Active</span>
            </div>
          </div>

          <div class="stat-card">
            <ClockIcon class="stat-icon pending" />
            <div class="stat-info">
              <span class="stat-value">{{ userStats.pending }}</span>
              <span class="stat-label">Pending</span>
            </div>
          </div>

          <div class="stat-card">
            <ShieldCheckIcon class="stat-icon admin" />
            <div class="stat-info">
              <span class="stat-value">{{ userStats.admins }}</span>
              <span class="stat-label">Admins</span>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <CardView title="Users" class="users-card">
          <template #actions>
            <button @click="exportUsers" class="export-btn">
              <ArrowDownTrayIcon class="icon" />
              Export
            </button>
          </template>

          <div class="table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th @click="sort('name')" class="sortable">
                    Name
                    <ChevronUpDownIcon class="sort-icon" />
                  </th>
                  <th @click="sort('email')" class="sortable">
                    Email
                    <ChevronUpDownIcon class="sort-icon" />
                  </th>
                  <th>Role</th>
                  <th>Status</th>
                  <th @click="sort('lastLogin')" class="sortable">
                    Last Login
                    <ChevronUpDownIcon class="sort-icon" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
                  <td class="user-cell">
                    <div class="user-info">
                      <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                      <div>
                        <p class="user-name">{{ user.name }}</p>
                        <p class="user-username">@{{ user.username }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="email-cell">{{ user.email }}</td>

                  <td>
                    <span class="role-badge" :class="user.role">
                      {{ user.role }}
                    </span>
                  </td>

                  <td>
                    <span class="status-badge" :class="user.status">
                      {{ user.status }}
                    </span>
                  </td>

                  <td class="date-cell">
                    {{ user.lastLogin ? formatTimeAgo(user.lastLogin) : 'Never' }}
                  </td>

                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button @click="editUser(user)" class="action-btn edit">
                        <PencilIcon class="icon" />
                      </button>
                      <button @click="toggleUserStatus(user)" class="action-btn toggle">
                        <component :is="user.status === 'active' ? EyeSlashIcon : EyeIcon" class="icon" />
                      </button>
                      <button @click="deleteUser(user)" class="action-btn delete">
                        <TrashIcon class="icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
              Next
            </button>
          </div>
        </CardView>
      </div>
    </main>

    <!-- Add/Edit User Modal -->
    <ModalView :show="showAddModal" @close="closeModal" :title="editingUser ? 'Edit User' : 'Add User'">
      <form @submit.prevent="saveUser" class="user-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input v-model="userForm.name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Username</label>
            <input v-model="userForm.username" type="text" class="form-input" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="userForm.email" type="email" class="form-input" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Role</label>
            <select v-model="userForm.role" class="form-select">
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="userForm.status" class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div v-if="!editingUser" class="form-group">
          <label class="form-label">Password</label>
          <input v-model="userForm.password" type="password" class="form-input" required />
        </div>
      </form>

      <template #footer>
        <div class="modal-actions">
          <button @click="closeModal" class="cancel-btn">Cancel</button>
          <button @click="saveUser" class="save-btn">
            {{ editingUser ? 'Update' : 'Create' }}
          </button>
        </div>
      </template>
    </ModalView>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import adminService from '@/services/admin.service'
import AppHeaderView from '@/components/layout/AppHeaderView.vue'
import AppSidebarView from '@/components/layout/AppSidebarView.vue'
import CardView from '@/components/ui/CardView.vue'
import ModalView from '@/components/ui/ModalView.vue'
import { formatTimeAgo } from '@/utils/helpers'
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ChevronUpDownIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const sidebarOpen = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const editingUser = ref(null)
const currentPage = ref(1)
const pageSize = 10
const sortField = ref('name')
const sortDirection = ref('asc')

const userForm = reactive({
  name: '',
  username: '',
  email: '',
  role: 'user',
  status: 'active',
  password: ''
})

const users = ref([
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    avatar: '/default-avatar.png',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date('2023-01-15')
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
    role: 'user',
    status: 'active',
    avatar: '/default-avatar.png',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date('2023-02-20')
  },
  {
    id: 3,
    name: 'Bob Johnson',
    username: 'bobjohnson',
    email: 'bob.johnson@example.com',
    role: 'moderator',
    status: 'inactive',
    avatar: '/default-avatar.png',
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2023-03-10')
  },
  {
    id: 4,
    name: 'Alice Brown',
    username: 'alicebrown',
    email: 'alice.brown@example.com',
    role: 'user',
    status: 'pending',
    avatar: '/default-avatar.png',
    lastLogin: null,
    createdAt: new Date()
  }
])

const userStats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.status === 'active').length,
  pending: users.value.filter(u => u.status === 'pending').length,
  admins: users.value.filter(u => u.role === 'admin').length
}))

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  // Paginate
  const start = (currentPage.value - 1) * pageSize
  return filtered.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  const total = users.value.length
  return Math.ceil(total / pageSize)
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const sort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    password: ''
  })
  showAddModal.value = true
}

const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

const deleteUser = (user) => {
  if (confirm(`Delete user ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) users.value.splice(index, 1)
  }
}

const saveUser = () => {
  if (editingUser.value) {
    Object.assign(editingUser.value, userForm)
  } else {
    users.value.push({
      id: Date.now(),
      ...userForm,
      avatar: '/default-avatar.png',
      lastLogin: null,
      createdAt: new Date()
    })
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingUser.value = null
  Object.assign(userForm, {
    name: '',
    username: '',
    email: '',
    role: 'user',
    status: 'active',
    password: ''
  })
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const exportUsers = () => {
  console.log('Export users')
}
</script>

<style scoped>
.users-page {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .users-page {
  background: #111827;
}

.main-content {
  margin-left: 0;
  padding-top: 4rem;
  transition: margin-left 0.3s ease;
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: 16rem;
  }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.dark .page-title {
  color: white;
}

.page-subtitle {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.dark .page-subtitle {
  color: #9ca3af;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #2563eb;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #1f2937;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.dark .search-input {
  background: #1f2937;
  border-color: #374151;
  color: white;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #1f2937;
}

.dark .filter-select {
  background: #1f2937;
  border-color: #374151;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dark .stat-card {
  background: #1f2937;
  border-color: #374151;
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: #dbeafe;
  color: #2563eb;
}

.stat-icon.active {
  background: #d1fae5;
  color: #059669;
}

.stat-icon.pending {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon.admin {
  background: #f3e8ff;
  color: #a855f7;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.dark .stat-value {
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .stat-label {
  color: #9ca3af;
}

.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 0.75rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.dark .users-table th {
  color: #d1d5db;
  border-color: #374151;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.users-table th.sortable:hover {
  background: #f9fafb;
}

.dark .users-table th.sortable:hover {
  background: #374151;
}

.sort-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.25rem;
  display: inline;
}

.users-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.dark .users-table td {
  border-color: #374151;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.dark .user-name {
  color: white;
}

.user-username {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .user-username {
  color: #9ca3af;
}

.role-badge,
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.moderator {
  background: #e0e7ff;
  color: #3730a3;
}

.role-badge.user {
  background: #f3f4f6;
  color: #374151;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.edit {
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: #eff6ff;
}

.action-btn.toggle {
  color: #10b981;
}

.action-btn.toggle:hover {
  background: #ecfdf5;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fef2f2;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .pagination {
  border-color: #374151;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark .page-btn {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.dark .page-info {
  color: #9ca3af;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.dark .form-label {
  color: #d1d5db;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #1f2937;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.dark .form-input,
.dark .form-select {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-btn,
.save-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: #3b82f6;
  color: white;
}

.save-btn:hover {
  background: #2563eb;
}

.dark .cancel-btn {
  background: #374151;
  color: #d1d5db;
}

.dark .cancel-btn:hover {
  background: #4b5563;
}
</style>
