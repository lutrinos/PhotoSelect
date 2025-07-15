"use client";

import { Bucket } from '@/type';
import { Center, Button, Paper, Container, Title, Text, Divider, Card, Flex, Progress, ScrollArea } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBuckets } from './action';

const BucketList = ({ buckets }: any) => {
  return (
    <ScrollArea.Autosize mah={400} my={12}>
      <div className='flex flex-col flex-nowrap gap-1'>

        {
          buckets.map((bucket: Bucket) => {
            const p = bucket.total === 0 ? 0 : bucket.index / bucket.total;

            return (
              <Card
                key={bucket.id}
                component={Link}
                href={`/bucket/${bucket.id}`}
                w="100%"
                className='min-h-fit'
                withBorder
              //bg={p === null ? getThemeColor('green', theme) : `linear-gradient(90deg, var(--mantine-color-green-1) ${p * 100}%, var(--mantine-color-yellow-1) ${100}%)`}
              >
                <Flex justify="space-between">
                  <Text>{bucket.name}</Text>
                  <Text>{Math.round(p * 100)}%</Text>
                </Flex>

                <Progress className='absolute bottom-0' value={p * 100} />
              </Card>
            );
          })
        }
      </div>
    </ScrollArea.Autosize>
  );
}

export default function () {
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const updateBuckets = async () => {
    const res = await getBuckets();

    if (res.ok) {
      setBuckets(res.data);
    }
  }

  useEffect(() => {
    updateBuckets();
  }, []);

  return (
    <Center bg="var(--mantine-color-gray-light)" w="100vw" h="100vh" className='overflow-hidden'>
      <Container w="100%" size={460} my={30}>
        <Paper radius="md" p="lg" withBorder>
          <Title order={2}>Que souhaitez vous faire ?</Title>

          <BucketList buckets={buckets} />

          <Divider label="Ou créer une nouvelle sélection" labelPosition="center" my="lg" />
          <Button component={Link} href="/bucket/create" fullWidth>Créer une nouvelle sélection</Button>
        </Paper>
      </Container>
    </Center>
  );
}