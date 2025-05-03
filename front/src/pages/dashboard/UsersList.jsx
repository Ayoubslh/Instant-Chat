import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { customFetch } from '@/utils/fetch/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import showToast from '@/services/toast';
import { useState } from 'react';

function UsersList() {
  const [userState, setUserState] = useState({});

  const { data: users, isLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: async () => {
      const res = await customFetch.get('/user');
      const usersData = res.data.data;

      // initialize local state with user roles
      const initialState = {};
      usersData.forEach(user => {
        initialState[user._id] = { role: user.role, loading: false };
      });
      setUserState(initialState);

      return usersData;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async ({ id, role }) => {
      setUserState(prev => ({
        ...prev,
        [id]: { ...prev[id], loading: true },
      }));
      await customFetch.patch(`/user/${id}/role`, { role });
      return { id, role };
    },
    onSuccess: ({ id, role }) => {
      showToast('Role changed');
      setUserState(prev => ({
        ...prev,
        [id]: { role, loading: false },
      }));
    },
    onError: (_, { id }) => {
      showToast('An error occurred', 'error');
      setUserState(prev => ({
        ...prev,
        [id]: { ...prev[id], loading: false },
      }));
    },
  });

  const handleUpdateRole = (role, id) => {
    // Optimistic update
    setUserState(prev => ({
      ...prev,
      [id]: { ...prev[id], role },
    }));
    mutate({ id, role });
  };

  const columns = [
    {
      accessorKey: 'fullName',
      header: 'Full Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const id = row.getValue('_id');
        const role = userState[id]?.role || row.getValue('role');

        return (
          <div
            className={cn(
              'py-1 px-4 rounded-md text-center cursor-default',
              {
                admin: 'bg-primary/30',
                client: 'border-2',
              }[role.toLowerCase()]
            )}
          >
            {role}
          </div>
        );
      },
    },
    {
      accessorKey: '_id',
      header: '',
      cell: ({ row }) => {
        const id = row.getValue('_id');
        const role = userState[id]?.role || row.getValue('role');
        const loading = userState[id]?.loading || false;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={loading}>
                <Ellipsis className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Manage User</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={role}
                onValueChange={newRole => handleUpdateRole(newRole, id)}
              >
                <DropdownMenuRadioItem value="Admin">
                  Admin
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Client">
                  Client
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return 'loading...';

  return (
    <div className="space-y-5 flex flex-wrap justify-between @container">
      <h1 className="text-2xl font-semibold">Users List</h1>
      <DataTable columns={columns} data={users} filter='email' link='/dashboard/contacts/user' />
    </div>
  );
}

export default UsersList;
