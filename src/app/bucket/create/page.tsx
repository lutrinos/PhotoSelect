"use client";

import { Box, Button, Group, Paper, TextInput, Container, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createBucket } from './action';
import { notifications } from '@mantine/notifications';
import { redirect, RedirectType } from 'next/navigation';
import { useState } from 'react';


export default function () {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            source: ''
        },

        validate: {
            name: (v) => {
                return v.trim().length <= 0
            }
        },
    });

    return (
        <Box bg="var(--mantine-color-gray-light)" w="100vw" h="100vh" className='overflow-hidden'>
            <Container size={460} my={30}>
                <Title ta="center">
                    Créer une sélection
                </Title>

                <Paper withBorder shadow="md" p={20} radius="md" mt="xl">
                    <form onSubmit={form.onSubmit((values) => {
                        setLoading(true);
                        var id = notifications.show({
                            title: 'Création de la sélection',
                            message: 'Cela peut prendre un peu de temps, ne fermez pas la fenêtre.',
                            color: 'yellow'
                        });

                        createBucket(values.name, values.source)
                            .then((res) => {
                                if (res.ok) {
                                    notifications.update({
                                        id,
                                        message: 'Sélection créée avec succès !',
                                        color: 'green'
                                    });
                                    redirect(`/bucket/${res.data}`, RedirectType.replace);
                                } else {
                                    notifications.update({
                                        id,
                                        message: "Une erreur s'est produite : " + (res.error ?? 'Erreur non fournie'),
                                        color: 'red'
                                    });
                                    setLoading(false);
                                }
                            });
                    })}>
                        <TextInput
                            withAsterisk
                            required
                            label="Nom"
                            placeholder="Nom de la sélection"
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            withAsterisk
                            label="Source"
                            required
                            description="Chemin d'accès du dossier avec les images"
                            placeholder="C:\Users\JohnDoe"
                            key={form.key('source')}
                            {...form.getInputProps('source')}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button disabled={loading} type="submit">Créer</Button>
                        </Group>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}