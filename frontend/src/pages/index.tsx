import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
} from '@chakra-ui/react';
import { apiClient } from '../api/client';

interface NameEntry {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface FullName {
  id: string;
  fullName: string;
  createdAt: string;
}

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameEntries, setNameEntries] = useState<NameEntry[]>([]);
  const [fullNames, setFullNames] = useState<FullName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // データを取得
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getEntries();
      setNameEntries(data.nameEntries);
      setFullNames(data.fullNames);
    } catch (error) {
      toast({
        title: 'データの取得に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // コンポーネントがマウントされたらデータを取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 名前を送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: '性と名を入力してください',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createName({ firstName, lastName });
      toast({
        title: '名前が登録されました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFirstName('');
      setLastName('');
      
      // データを再取得
      fetchData();
    } catch (error) {
      toast({
        title: '登録に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP');
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" mb={6}>名前登録アプリ</Heading>
      
      <Box as="form" onSubmit={handleSubmit} mb={10} p={5} borderWidth={1} borderRadius="lg">
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>性</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="山田"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>名</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="太郎"
            />
          </FormControl>
        </Stack>
        
        <Button
          mt={4}
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
          loadingText="送信中..."
        >
          送信
        </Button>
      </Box>
      
      <Divider my={6} />
      
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4}>登録データ</Heading>
        <Text mb={4}>名前エントリ一覧</Text>
        
        <Box overflowX="auto">
          <Table variant="simple" mb={8}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>性</Th>
                <Th>名</Th>
                <Th>登録日時</Th>
              </Tr>
            </Thead>
            <Tbody>
              {nameEntries.length > 0 ? (
                nameEntries.map((entry) => (
                  <Tr key={entry.id}>
                    <Td>{entry.id.slice(0, 8)}...</Td>
                    <Td>{entry.lastName}</Td>
                    <Td>{entry.firstName}</Td>
                    <Td>{formatDate(entry.createdAt)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    {isLoading ? 'データ読み込み中...' : 'データがありません'}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        
        <Text mb={4}>フルネーム一覧</Text>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>フルネーム</Th>
                <Th>登録日時</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fullNames.length > 0 ? (
                fullNames.map((fullName) => (
                  <Tr key={fullName.id}>
                    <Td>{fullName.id.slice(0, 8)}...</Td>
                    <Td>{fullName.fullName}</Td>
                    <Td>{formatDate(fullName.createdAt)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    {isLoading ? 'データ読み込み中...' : 'データがありません'}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
}
