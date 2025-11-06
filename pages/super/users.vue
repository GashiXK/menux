<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-ink-950 dark:via-ink-900 dark:to-ink-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Modern Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p class="text-ink-600 dark:text-ink-300 text-lg">
              View and manage users across all tenants
            </p>
          </div>
          <button
            @click="showAddUserDialog = true"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Add User to Tenant
          </button>
        </div>
      </div>

      <!-- Filter and Stats -->
      <div class="mb-8 space-y-6">
        <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label class="text-sm font-medium text-ink-700 dark:text-ink-300">Filter by Tenant:</label>
            <div class="flex items-center gap-3 flex-1 max-w-md">
              <select
                v-model="selectedTenantId"
                class="flex-1 px-4 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option :value="null">All Tenants</option>
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                  {{ tenant.name }}
                </option>
              </select>
              <button
                v-if="selectedTenantId"
                @click="selectedTenantId = null"
                class="px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div v-if="!loading && filteredUsers.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Total Users</p>
                <p class="text-3xl font-bold text-ink-900 dark:text-white">{{ filteredUsers.length }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-users" class="w-6 h-6 text-brand-500" />
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Admins</p>
                <p class="text-3xl font-bold text-brand-500">{{ adminCount }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-brand-500" />
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Owners</p>
                <p class="text-3xl font-bold text-green-500">{{ ownerCount }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-star" class="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-ink-500 dark:text-ink-400 text-sm font-medium mb-1">Tenants</p>
                <p class="text-3xl font-bold text-brand-500">{{ uniqueTenants }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-brand-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-ink-200 dark:bg-ink-700 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-ink-200 dark:bg-ink-700 rounded w-1/3"></div>
              <div class="h-3 bg-ink-200 dark:bg-ink-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Grid -->
      <div v-else-if="filteredUsers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in filteredUsers"
          :key="`${user.tenant_id}-${user.user_id}`"
          class="group bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-lg border border-ink-100 dark:border-ink-800 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <!-- User Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <UIcon name="i-heroicons-user" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-ink-900 dark:text-white truncate mb-1">
                  {{ user.full_name || user.email || 'No name' }}
                </h3>
                <p class="text-sm text-ink-500 dark:text-ink-400 truncate">
                  {{ user.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- User Details -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2">
              <span
                v-if="user.tenant?.name"
                class="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400"
              >
                {{ user.tenant.name }}
              </span>
              <span v-else class="text-sm text-ink-500 dark:text-ink-400">No tenant</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300 capitalize">
                Role: <strong>{{ user.role }}</strong>
              </span>
            </div>
            <div v-if="user.is_owner" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-star" class="w-4 h-4 text-green-500" />
              <span class="text-green-600 dark:text-green-400 font-semibold">Tenant Owner</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-ink-400" />
              <span class="text-ink-600 dark:text-ink-300">
                Joined {{ formatDate(user.created_at) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-ink-100 dark:border-ink-800">
            <button
              @click="editUserRole(user)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit Role
            </button>
            <button
              @click="confirmRemoveUser(user)"
              class="flex-1 min-w-[100px] px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/30">
            <UIcon name="i-heroicons-users" class="w-12 h-12 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-ink-900 dark:text-white mb-3">
            {{ selectedTenantId ? 'No users found for this tenant' : 'No users found' }}
          </h3>
          <p class="text-ink-600 dark:text-ink-400 mb-8 text-lg">
            {{ selectedTenantId ? 'Add users to this tenant' : 'Get started by adding a user to a tenant' }}
          </p>
          <button
            @click="showAddUserDialog = true"
            class="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all duration-300 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 mx-auto"
          >
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddUserDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="resetUserForm"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="resetUserForm"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Add User to Tenant</h2>
              <button
                @click="resetUserForm"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="handleAddUser" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Tenant <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="userForm.tenant_id"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option :value="null">Select tenant</option>
                    <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                      {{ tenant.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="userForm.email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="userForm.password"
                    type="password"
                    placeholder="Secure password"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <p class="text-xs text-ink-500 dark:text-ink-400 mt-2">Required if creating new user</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Full Name
                  </label>
                  <input
                    v-model="userForm.full_name"
                    type="text"
                    placeholder="Optional full name"
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="userForm.role"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Owner
                  </label>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="userForm.is_owner = !userForm.is_owner"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        userForm.is_owner ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          userForm.is_owner ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-ink-600 dark:text-ink-400">
                      Set as tenant owner
                    </span>
                  </div>
                </div>
              </form>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="resetUserForm"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleAddUser"
                :disabled="savingUser"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="savingUser" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Role Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showEditRoleDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showEditRoleDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showEditRoleDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
            <div class="flex items-center justify-between p-6 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-2xl font-bold text-ink-900 dark:text-white">Edit User Role</h2>
              <button
                @click="showEditRoleDialog = false"
                class="p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-ink-500 dark:text-ink-400" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="handleUpdateRole" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Tenant
                  </label>
                  <input
                    :value="editingUser?.tenant?.name"
                    disabled
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-400 opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    User
                  </label>
                  <input
                    :value="editingUser?.full_name || editingUser?.email"
                    disabled
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-400 opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="roleForm.role"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Owner
                  </label>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="roleForm.is_owner = !roleForm.is_owner"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        roleForm.is_owner ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          roleForm.is_owner ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                    <span class="text-sm text-ink-600 dark:text-ink-400">
                      Set as tenant owner
                    </span>
                  </div>
                </div>
              </form>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="showEditRoleDialog = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleUpdateRole"
                :disabled="savingUser"
                class="px-6 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="savingUser" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                <UIcon v-else name="i-heroicons-check-circle" class="w-4 h-4" />
                Update Role
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Remove User Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showRemoveUserDialog"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showRemoveUserDialog = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showRemoveUserDialog = false"></div>
          <div class="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl max-w-lg w-full z-10">
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div class="shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-ink-900 dark:text-white mb-2">
                    Remove User from Tenant
                  </h3>
                  <p class="text-ink-600 dark:text-ink-400 mb-2">
                    Are you sure you want to remove <strong>{{ removingUser?.full_name || removingUser?.email }}</strong> from <strong>{{ removingUser?.tenant?.name }}</strong>?
                  </p>
                  <p class="text-sm text-ink-500 dark:text-ink-400">
                    This user will lose access to this tenant's dashboard. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="border-t border-ink-100 dark:border-ink-800 p-6 flex justify-end gap-3">
              <button
                @click="showRemoveUserDialog = false"
                class="px-6 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleRemoveUser"
                class="px-6 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center gap-2"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                Remove User
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Tenant } from '~/types/database'

interface TenantUserWithDetails {
  email: string
  full_name: string
  user_id: string
  tenant_id: string
  role: 'admin' | 'editor' | 'viewer'
  is_owner: boolean
  created_at: string
  tenant?: Tenant
}

type TenantRole = 'admin' | 'editor' | 'viewer'

definePageMeta({
  layout: 'super',
  middleware: ['super-admin']
})

const { client } = useSupabaseClientStrict()
const toast = useToast()

const tenants = ref<Tenant[]>([])
const allUsers = ref<TenantUserWithDetails[]>([])
const loading = ref(true)
const showAddUserDialog = ref(false)
const showEditRoleDialog = ref(false)
const showRemoveUserDialog = ref(false)
const selectedTenantId = ref<string | null>(null)
const editingUser = ref<TenantUserWithDetails | null>(null)
const removingUser = ref<TenantUserWithDetails | null>(null)
const savingUser = ref(false)

const userForm = reactive({
  tenant_id: null as string | null,
  email: '',
  password: '',
  full_name: '',
  role: 'admin' as 'admin' | 'editor' | 'viewer',
  is_owner: false
})

const roleForm = reactive({
  role: 'admin' as 'admin' | 'editor' | 'viewer',
  is_owner: false
})

const filteredUsers = computed(() => {
  if (!selectedTenantId.value) return allUsers.value
  return allUsers.value.filter(u => u.tenant_id === selectedTenantId.value)
})

const adminCount = computed(() => filteredUsers.value.filter(u => u.role === 'admin').length)
const ownerCount = computed(() => filteredUsers.value.filter(u => u.is_owner).length)
const uniqueTenants = computed(() => new Set(filteredUsers.value.map(u => u.tenant_id)).size)

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

const loadData = async () => {
  loading.value = true
  try {
    const { data: tenantsData, error: tenantsError } = await client
      .from('tenants')
      .select('*')
      .order('name')

    if (tenantsError) throw tenantsError
    tenants.value = tenantsData || []

    const { data: { session } } = await client.auth.getSession()

    if (!session?.access_token) {
      const { data: tenantUsersData, error: usersError } = await client
        .from('tenant_users')
        .select('*, tenant:tenants(*), user:profiles(*)')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      allUsers.value = (tenantUsersData || []).map((tu: any) => ({
        email: tu.user?.email || 'N/A',
        full_name: tu.user?.full_name || tu.user?.email?.split('@')[0] || 'No name',
        user_id: tu.user_id,
        tenant_id: tu.tenant_id,
        role: tu.role as TenantRole,
        is_owner: tu.is_owner,
        created_at: tu.created_at,
        tenant: tu.tenant
      }))
      loading.value = false
      return
    }

    try {
      const data = await $fetch('/api/admin/get-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      allUsers.value = Array.isArray(data) ? data : []
    } catch (apiError: any) {
      const { data: tenantUsersData, error: usersError } = await client
        .from('tenant_users')
        .select('*, tenant:tenants(*), user:profiles(*)')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      allUsers.value = (tenantUsersData || []).map((tu: any) => ({
        email: tu.user?.email || 'N/A',
        full_name: tu.user?.full_name || tu.user?.email?.split('@')[0] || 'No name',
        user_id: tu.user_id,
        tenant_id: tu.tenant_id,
        role: tu.role as TenantRole,
        is_owner: tu.is_owner,
        created_at: tu.created_at,
        tenant: tu.tenant
      }))
    }
  } catch (err: unknown) {
    const errObj = err as { message?: string }
    toast.add({
      title: 'Error',
      description: errObj.message || 'Failed to load users',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

const handleAddUser = async () => {
  if (!userForm.tenant_id || !userForm.email || !userForm.password) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all required fields',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
    return
  }

  savingUser.value = true
  try {
    const { data: { session } } = await client.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No active session')
    }

    const result = await $fetch('/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: {
        email: userForm.email,
        password: userForm.password,
        full_name: userForm.full_name || null,
        tenant_id: userForm.tenant_id,
        role: userForm.role
      }
    })

    if (userForm.is_owner && result?.user_id) {
      await client
        .from('tenant_users')
        .update({ is_owner: true })
        .eq('tenant_id', userForm.tenant_id)
        .eq('user_id', result.user_id)
    }

    await loadData()
    resetUserForm()
    toast.add({
      title: 'Success',
      description: 'User created and added to tenant successfully!',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (err: unknown) {
    const error = err as { data?: { statusMessage?: string }; message?: string }
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || error.message || 'Failed to create user.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    savingUser.value = false
  }
}

const editUserRole = (user: TenantUserWithDetails) => {
  editingUser.value = user
  roleForm.role = user.role
  roleForm.is_owner = user.is_owner
  showEditRoleDialog.value = true
}

const handleUpdateRole = async () => {
  if (!editingUser.value) return

  savingUser.value = true
  try {
    await client
      .from('tenant_users')
      .update({
        role: roleForm.role,
        is_owner: roleForm.is_owner
      })
      .eq('tenant_id', editingUser.value.tenant_id)
      .eq('user_id', editingUser.value.user_id)

    await loadData()
    showEditRoleDialog.value = false
    editingUser.value = null
    toast.add({
      title: 'Success',
      description: 'User role updated successfully!',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update user role.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  } finally {
    savingUser.value = false
  }
}

const confirmRemoveUser = (user: TenantUserWithDetails) => {
  removingUser.value = user
  showRemoveUserDialog.value = true
}

const handleRemoveUser = async () => {
  if (!removingUser.value) return

  try {
    await client
      .from('tenant_users')
      .delete()
      .eq('tenant_id', removingUser.value.tenant_id)
      .eq('user_id', removingUser.value.user_id)

    await loadData()
    showRemoveUserDialog.value = false
    removingUser.value = null

    toast.add({
      title: 'Success',
      description: 'User removed from tenant successfully!',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to remove user.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000
    })
  }
}

const resetUserForm = () => {
  userForm.tenant_id = null
  userForm.email = ''
  userForm.password = ''
  userForm.full_name = ''
  userForm.role = 'admin'
  userForm.is_owner = false
  showAddUserDialog.value = false
}

onMounted(async () => {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  await loadData()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
